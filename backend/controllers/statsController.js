const { getProjects } = require('../services/dataService');
const { ROLE_ALLOWED_STATUSES } = require('../middleware/auth');

/**
 * GET /api/stats
 * Aggregate dashboard statistics filtered by user role
 */
const getDashboardStats = async (req, res) => {
  try {
    const user = req.user;
    const all = await getProjects();

    const allowed = ROLE_ALLOWED_STATUSES[user.role] || ['ongoing', 'complete'];

    let active = all.filter((p) => !p.deleted && allowed.includes(p.status));
    let trashed = all.filter((p) => p.deleted && allowed.includes(p.status));

    if (user.role === 'Employee') {
      active = active.filter(
        (p) =>
          (Array.isArray(p.assignees) && p.assignees.some((a) => String(a) === String(user.id))) ||
          String(p.createdBy) === String(user.id)
      );
      trashed = trashed.filter(
        (p) =>
          (Array.isArray(p.assignees) && p.assignees.some((a) => String(a) === String(user.id))) ||
          String(p.createdBy) === String(user.id)
      );
    }

    const pendingCount = active.filter((p) => p.status === 'pending').length;
    const ongoingCount = active.filter((p) => p.status === 'ongoing').length;
    const yetToFinalCount = active.filter((p) => p.status === 'yetToFinal').length;
    const completedCount = active.filter((p) => p.status === 'complete').length;

    const totalHours = active.reduce((acc, p) => acc + (Number(p.estimatedHours) || 0), 0);

    return res.status(200).json({
      success: true,
      stats: {
        totalProjectDone: 322 + completedCount,
        totalProjectDoneGrowth: '+0.4% More than last month',
        clientOnboard: 21,
        clientOnboardGrowth: '+1.5% More than last week',
        newTaskOnboard: 532 + pendingCount + ongoingCount,
        newTaskOnboardGrowth: '+3.5% More than last week',
        totalHoursWorks: (544.4 + totalHours).toFixed(1),
        totalHoursGrowth: '+3.5% from last month',
        counts: {
          pending: pendingCount,
          ongoing: ongoingCount,
          yetToFinal: yetToFinalCount,
          complete: completedCount,
          trash: trashed.length,
          totalActive: active.length,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to compute stats', error: error.message });
  }
};

module.exports = { getDashboardStats };

