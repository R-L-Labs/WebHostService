import { PrismaClient } from '@prisma/client';
import Decimal from 'decimal.js';

const prisma = new PrismaClient();

/**
 * @route   GET /api/payments/client/:clientId
 * @desc    Get all payments for a client
 * @access  Private
 */
export const getClientPayments = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    // Verify client exists
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    const payments = await prisma.payment.findMany({
      where: { clientId },
      orderBy: { paymentDate: 'desc' },
    });

    // Calculate totals using Decimal for precision
    const totalPaid = payments
      .filter((p) => p.status === 'PAID')
      .reduce((sum, p) => sum.plus(p.amount), new Decimal(0))
      .toNumber();

    const totalPending = payments
      .filter((p) => p.status === 'PENDING')
      .reduce((sum, p) => sum.plus(p.amount), new Decimal(0))
      .toNumber();

    res.status(200).json({
      success: true,
      data: {
        payments,
        summary: {
          totalPaid,
          totalPending,
          count: payments.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/payments
 * @desc    Create a new payment
 * @access  Private
 */
export const createPayment = async (req, res, next) => {
  try {
    const { clientId, amount, description, paymentDate, paymentMethod, status, notes } = req.body;

    // Validate required fields
    if (!clientId || !amount || !paymentDate) {
      return res.status(400).json({
        success: false,
        message: 'Client ID, amount, and payment date are required',
      });
    }

    // Verify client exists
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    const payment = await prisma.payment.create({
      data: {
        clientId,
        amount: parseFloat(amount),
        description,
        paymentDate: new Date(paymentDate),
        paymentMethod: paymentMethod || 'OTHER',
        status: status || 'PENDING',
        notes,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: { payment },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/payments/:id
 * @desc    Update a payment
 * @access  Private
 */
export const updatePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, description, paymentDate, paymentMethod, status, notes } = req.body;

    // Check if payment exists
    const existingPayment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!existingPayment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(description !== undefined && { description }),
        ...(paymentDate !== undefined && { paymentDate: new Date(paymentDate) }),
        ...(paymentMethod !== undefined && { paymentMethod }),
        ...(status !== undefined && { status }),
        ...(notes !== undefined && { notes }),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      data: { payment },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/payments/:id
 * @desc    Delete a payment
 * @access  Private
 */
export const deletePayment = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if payment exists
    const existingPayment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!existingPayment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    await prisma.payment.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/payments/:id
 * @desc    Get a single payment
 * @access  Private
 */
export const getPayment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            businessName: true,
            contactName: true,
            email: true,
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { payment },
    });
  } catch (error) {
    next(error);
  }
};
