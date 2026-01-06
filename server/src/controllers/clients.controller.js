import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @route   GET /api/clients
 * @desc    Get all clients with pagination, search, and filtering
 * @access  Private
 */
export const getClients = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {};

    // Add search filter
    if (search) {
      where.OR = [
        { businessName: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Add status filter
    if (status && status !== 'ALL') {
      where.status = status;
    }

    // Get clients with pagination
    const [clients, totalCount] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          package: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.client.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        clients,
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
 * @route   GET /api/clients/stats
 * @desc    Get client statistics
 * @access  Private
 */
export const getClientStats = async (req, res, next) => {
  try {
    const [totalClients, activeClients, prospectClients, inactiveClients] = await Promise.all([
      prisma.client.count(),
      prisma.client.count({ where: { status: 'ACTIVE' } }),
      prisma.client.count({ where: { status: 'PROSPECT' } }),
      prisma.client.count({ where: { status: 'INACTIVE' } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalClients,
          activeClients,
          prospectClients,
          inactiveClients,
          cancelledClients: totalClients - activeClients - prospectClients - inactiveClients,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/clients/:id
 * @desc    Get single client by ID
 * @access  Private
 */
export const getClient = async (req, res, next) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        package: true,
      },
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { client },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/clients
 * @desc    Create new client
 * @access  Private
 */
export const createClient = async (req, res, next) => {
  try {
    const {
      businessName,
      contactName,
      email,
      phone,
      website,
      status,
      packageId,
      notes,
    } = req.body;

    // Validate required fields
    if (!businessName || !contactName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Business name, contact name, and email are required',
      });
    }

    const client = await prisma.client.create({
      data: {
        businessName,
        contactName,
        email: email.toLowerCase().trim(),
        phone,
        website,
        status: status || 'PROSPECT',
        packageId: packageId || null,
        notes,
      },
      include: {
        package: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: { client },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/clients/:id
 * @desc    Update client
 * @access  Private
 */
export const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If email is being updated, normalize it
    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase().trim();
    }

    const client = await prisma.client.update({
      where: { id },
      data: updateData,
      include: {
        package: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: { client },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/clients/:id
 * @desc    Delete client
 * @access  Private
 */
export const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.client.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
