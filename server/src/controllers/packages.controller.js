import prisma from '../lib/prisma.js';
import logger from '../utils/logger.utils.js';

/**
 * Safely parse JSON with fallback value
 */
const safeParseJSON = (str, fallback = []) => {
  try {
    return JSON.parse(str);
  } catch (err) {
    logger.warn({ err, value: str?.substring?.(0, 100) }, 'JSON parse failed');
    return fallback;
  }
};

/**
 * @route   GET /api/packages
 * @desc    Get all active packages (public)
 * @access  Public
 */
export const getPackages = async (req, res, next) => {
  try {
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    // Parse JSON features for each package
    const packagesWithFeatures = packages.map(pkg => ({
      ...pkg,
      features: safeParseJSON(pkg.features, []),
    }));

    res.status(200).json({
      success: true,
      data: { packages: packagesWithFeatures },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/packages/:id
 * @desc    Get single package by ID (public)
 * @access  Public
 */
export const getPackage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pkg = await prisma.package.findUnique({
      where: { id },
    });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Package not found',
      });
    }

    // Parse JSON features
    const packageWithFeatures = {
      ...pkg,
      features: safeParseJSON(pkg.features, []),
    };

    res.status(200).json({
      success: true,
      data: { package: packageWithFeatures },
    });
  } catch (error) {
    next(error);
  }
};
