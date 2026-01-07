import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @route   POST /api/inquiries
 * @desc    Submit a new inquiry (public)
 * @access  Public
 */
export const submitInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, businessName, interestedPackage, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        phone,
        businessName,
        interestedPackage,
        message,
        status: 'NEW',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your inquiry! We will get back to you soon.',
      data: { inquiry },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/inquiries
 * @desc    Get all inquiries with pagination and filtering
 * @access  Private
 */
export const getInquiries = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = '',
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {};

    // Add status filter
    if (status && status !== 'ALL') {
      where.status = status;
    }

    // Get inquiries with pagination and counts (all queries run concurrently)
    const [inquiries, totalCount, newInquiriesCount] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.inquiry.count({ where }),
      prisma.inquiry.count({ where: { status: 'NEW' } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        inquiries,
        newInquiriesCount,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/inquiries/:id
 * @desc    Get single inquiry by ID
 * @access  Private
 */
export const getInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { inquiry },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/inquiries/:id
 * @desc    Update inquiry status
 * @access  Private
 */
export const updateInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    // Get the current inquiry first
    const currentInquiry = await prisma.inquiry.findUnique({
      where: { id },
    });

    if (!currentInquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    // Update the inquiry status
    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { status },
    });

    let client = null;

    // If status is being changed to CONVERTED, create a client automatically
    if (status === 'CONVERTED' && currentInquiry.status !== 'CONVERTED') {
      // Check if a client with this email already exists
      const existingClient = await prisma.client.findUnique({
        where: { email: inquiry.email },
      });

      if (!existingClient) {
        // Create a new client from the inquiry data
        client = await prisma.client.create({
          data: {
            businessName: inquiry.businessName || `${inquiry.name}'s Business`,
            contactName: inquiry.name,
            email: inquiry.email,
            phone: inquiry.phone,
            status: 'PROSPECT',
            notes: `Converted from inquiry on ${new Date().toLocaleDateString()}.\n\nOriginal message:\n${inquiry.message}`,
          },
          include: {
            package: true,
          },
        });
      } else {
        client = existingClient;
      }
    }

    res.status(200).json({
      success: true,
      message: status === 'CONVERTED' && client
        ? 'Inquiry converted and client created successfully'
        : 'Inquiry updated successfully',
      data: {
        inquiry,
        client, // Will be null if not converted or client already existed
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/inquiries/:id
 * @desc    Delete inquiry
 * @access  Private
 */
export const deleteInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.inquiry.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
