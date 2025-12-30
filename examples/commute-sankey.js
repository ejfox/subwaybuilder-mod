/**
 * Commute Sankey Mod
 *
 * Beautiful Sankey diagram showing commuter flow through the transit system.
 *
 * This mod demonstrates:
 * - Using api.utils.React for UI components
 * - Using api.utils.charts.Sankey for data visualization
 * - Using api.ui.addToolbarPanel() for adding toolbar panels
 * - Using api.gameState.getModeChoiceStats() for commuter data
 * - Using api.gameState.getLineMetrics() for route data
 */

(function () {
    'use strict';

    var api = window.SubwayBuilderAPI;
    if (!api) return;

    var React = api.utils.React;
    var charts = api.utils.charts;
    var Badge = api.utils.components.Badge;

    if (!charts || !charts.Sankey) {
        api.ui.showNotification('Sankey chart not available', 'error');
        return;
    }

    var Sankey = charts.Sankey;
    var h = React.createElement;

    var COLORS = {
        transit: '#22c55e',
        driving: '#ef4444',
        walking: '#3b82f6',
        routes: ['#f59e0b', '#ec4899', '#06b6d4', '#84cc16'],
    };

    function CommuteSankey() {
        var stateHook = React.useState({ nodes: [], links: [] });
        var sankeyData = stateHook[0];
        var setSankeyData = stateHook[1];

        var statsHook = React.useState({ total: 0, transitShare: 0 });
        var stats = statsHook[0];
        var setStats = statsHook[1];

        React.useEffect(function () {
            function updateData() {
                var modes = api.gameState.getModeChoiceStats();
                var total = modes.walking + modes.driving + modes.transit;

                if (total === 0) {
                    setSankeyData({ nodes: [], links: [] });
                    return;
                }

                var transitShare = ((modes.transit / total) * 100).toFixed(1);
                var lineMetrics = api.gameState.getLineMetrics()
                    .filter(function (m) { return m.ridersPerHour > 0; })
                    .slice(0, 5);

                var nodes = [
                    { name: 'Commuters' },
                    { name: 'Transit' },
                    { name: 'Driving' },
                    { name: 'Walking' },
                    { name: 'Arrived' }
                ];

                var links = [
                    { source: 0, target: 1, value: modes.transit },
                    { source: 0, target: 2, value: modes.driving },
                    { source: 0, target: 3, value: modes.walking },
                    { source: 1, target: 4, value: modes.transit },
                    { source: 2, target: 4, value: modes.driving },
                    { source: 3, target: 4, value: modes.walking },
                ].filter(function (l) { return l.value > 0; });

                setSankeyData({ nodes: nodes, links: links });
                setStats({ total: total, transitShare: transitShare });
            }

            updateData();
            var interval = setInterval(updateData, 3000);
            return function () { clearInterval(interval); };
        }, []);

        if (sankeyData.nodes.length === 0) {
            return h('div', { className: 'p-8 text-center' }, 'Waiting for commute data...');
        }

        return h('div', { className: 'space-y-3' }, [
            h('div', { key: 'stats', className: 'flex justify-between' }, [
                h('span', null, stats.transitShare + '% Transit'),
                h('span', null, stats.total.toLocaleString() + ' commuters'),
            ]),
            h('div', { key: 'chart', style: { height: '280px' } },
                h(Sankey, {
                    width: 350, height: 260,
                    data: sankeyData,
                    nodePadding: 20, nodeWidth: 8,
                })
            ),
        ]);
    }

    api.ui.addToolbarPanel({
        id: 'commute-sankey',
        icon: 'GitBranch',
        tooltip: 'Commute Sankey',
        title: 'Commuter Flow',
        width: 400,
        render: CommuteSankey,
    });

    api.ui.showNotification('Commute Sankey loaded!', 'success');
})();
