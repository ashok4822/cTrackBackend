import { ContainerModel } from "../../infrastructure/models/ContainerModel";
import { GateOperationModel } from "../../infrastructure/models/GateOperationModel";
import { BlockModel } from "../../infrastructure/models/BlockModel";
import { ContainerHistoryModel } from "../../infrastructure/models/ContainerHistoryModel";
import { ContainerRequestModel } from "../../infrastructure/models/ContainerRequestModel";
import { EquipmentModel } from "../../infrastructure/models/EquipmentModel";

export class GetDashboardKPIs {
    async execute() {
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const [
            totalContainersInYard,
            containersInTransit,
            gateInToday,
            gateOutToday,
            blocks,
            gateMovementsRaw,
            containersInYard,
            recentActivitiesRaw,
            pendingRequestsCount,
            damagedContainers,
            equipmentIssues
        ] = await Promise.all([
            ContainerModel.countDocuments({ status: { $in: ["gate-in", "in-yard", "damaged"] } }),
            ContainerModel.countDocuments({ status: "in-transit" }),
            GateOperationModel.countDocuments({ type: "gate-in", timestamp: { $gte: startOfDay } }),
            GateOperationModel.countDocuments({ type: "gate-out", timestamp: { $gte: startOfDay } }),
            BlockModel.find({}),
            GateOperationModel.aggregate([
                {
                    $match: {
                        timestamp: { $gte: sevenDaysAgo }
                    }
                },
                {
                    $group: {
                        _id: {
                            day: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                            type: "$type"
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.day": 1 } }
            ]),
            ContainerModel.find({
                status: { $in: ["gate-in", "in-yard", "damaged"] },
                gateInTime: { $exists: true }
            }),
            ContainerHistoryModel.find()
                .sort({ timestamp: -1 })
                .limit(10)
                .populate('containerId', 'containerNumber'),
            ContainerRequestModel.countDocuments({ status: "pending" }),
            ContainerModel.find({ damaged: true }).limit(5),
            EquipmentModel.find({ status: { $in: ["down", "maintenance"] } })
        ]);

        // 1. Yard Utilization
        const totalCapacity = blocks.reduce((sum, block) => sum + block.capacity, 0);
        const totalOccupied = blocks.reduce((sum, block) => sum + block.occupied, 0);
        const yardUtilization = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

        // 2. Gate Movements (Last 7 Days)
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(sevenDaysAgo);
            d.setDate(sevenDaysAgo.getDate() + i);
            days.push(d.toISOString().split('T')[0]);
        }

        const gateMovements = days.map(day => {
            const dateObj = new Date(day);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

            const gateIn = gateMovementsRaw.find(m => m._id.day === day && m._id.type === 'gate-in')?.count || 0;
            const gateOut = gateMovementsRaw.find(m => m._id.day === day && m._id.type === 'gate-out')?.count || 0;

            return { name: dayName, gateIn, gateOut };
        });

        // 3. Dwell Time Distribution
        const buckets = [
            { name: "0-3 Days", value: 0 },
            { name: "3-7 Days", value: 0 },
            { name: "7-15 Days", value: 0 },
            { name: "15+ Days", value: 0 }
        ];

        containersInYard.forEach(container => {
            if (container.gateInTime) {
                const gateInTime = new Date(container.gateInTime);
                const diffDays = Math.floor((now.getTime() - gateInTime.getTime()) / (1000 * 60 * 60 * 24));

                if (diffDays <= 3) buckets[0].value++;
                else if (diffDays <= 7) buckets[1].value++;
                else if (diffDays <= 15) buckets[2].value++;
                else buckets[3].value++;
            }
        });

        const dwellTimeDistribution = buckets.filter(b => b.value > 0);
        // Fallback for UI if empty
        if (dwellTimeDistribution.length === 0) {
            dwellTimeDistribution.push({ name: "0-3 Days", value: 0 });
        }

        // 4. Recent Activity Mapping
        const recentActivities = recentActivitiesRaw.map(history => {
            let type = 'yard';
            const activity = (history.activity || '').toLowerCase();
            if (activity.includes('gate')) type = 'gate';
            if (activity.includes('payment')) type = 'payment';
            if (activity.includes('survey')) type = 'survey';
            if (activity.includes('approval')) type = 'approval';

            const containerNumber = (history.containerId as any)?.containerNumber || 'Unknown';

            return {
                id: (history as any)._id.toString(),
                action: history.activity,
                description: `Container ${containerNumber}: ${history.details || 'No details'}`,
                time: history.timestamp.toISOString(),
                type
            };
        });

        // 5. Derived Alerts
        const recentAlerts: any[] = [];

        if (pendingRequestsCount > 0) {
            recentAlerts.push({
                id: 'pending-requests',
                type: 'warning',
                title: 'Pending Approvals',
                message: `There are ${pendingRequestsCount} container requests pending approval.`,
                link: '/admin/requests'
            });
        }

        damagedContainers.forEach(container => {
            recentAlerts.push({
                id: `damaged-${container._id}`,
                type: 'error',
                title: 'Damaged Container',
                message: `Container ${container.containerNumber} reported with damage: ${container.damageDetails || 'No details'}.`,
                link: `/admin/containers`
            });
        });

        equipmentIssues.forEach(eq => {
            recentAlerts.push({
                id: `eq-${eq._id}`,
                type: eq.status === 'down' ? 'error' : 'info',
                title: eq.status === 'down' ? 'Equipment Down' : 'Equipment Maintenance',
                message: `${eq.type} ${eq.name} is currently ${eq.status}.`,
                link: '/admin/equipment'
            });
        });

        return {
            totalContainersInYard,
            containersInTransit,
            gateInToday,
            gateOutToday,
            yardUtilization,
            gateMovements,
            dwellTimeDistribution,
            recentActivities,
            recentAlerts
        };
    }
}
