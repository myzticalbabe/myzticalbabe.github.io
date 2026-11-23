/**
 * YGGDRASIL Forest Index - D3.js Force-Directed Visualization
 * Renders interactive domain trees from atlas JSON data
 */

const ForestApp = (function() {
    // State
    let manifest = null;
    let currentAtlas = null;
    let simulation = null;
    let svg = null;
    let g = null;
    let tooltip = null;
    let zoom = null;
    let selectedNode = null;
    
    // Color scales
    const domainColors = {};
    
    // DOM elements
    const elements = {
        canvas: null,
        domainSelect: null,
        resetBtn: null,
        nodeCount: null,
        nodeDetails: null,
        detailTitle: null,
        detailContent: null,
        closeDetails: null,
        domainCards: null
    };
    
    async function init() {
        cacheElements();
        setupEventListeners();
        await loadManifest();
        renderDomainCards();
        populateDomainSelect();
        initForestCanvas();
        setupZoom();
        createTooltip();
    }
    
    function cacheElements() {
        elements.canvas = document.getElementById('forest-canvas');
        elements.domainSelect = document.getElementById('domain-select');
        elements.resetBtn = document.getElementById('reset-view');
        elements.nodeCount = document.getElementById('node-count');
        elements.nodeDetails = document.getElementById('node-details');
        elements.detailTitle = document.getElementById('detail-title');
        elements.detailContent = document.getElementById('detail-content');
        elements.closeDetails = document.getElementById('close-details');
        elements.domainCards = document.getElementById('domain-cards');
    }
    
    function setupEventListeners() {
        elements.domainSelect.addEventListener('change', onDomainSelect);
        elements.resetBtn.addEventListener('click', resetView);
        elements.closeDetails.addEventListener('click', closeNodeDetails);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeNodeDetails();
            if (e.key === 'r' && !e.target.matches('input, select')) resetView();
        });
    }
    
    async function loadManifest() {
        try {
            const response = await fetch('data/forest_manifest.json');
            if (!response.ok) throw new Error('Failed to load manifest');
            manifest = await response.json();
            
            // Populate domain colors from manifest
            manifest.trees.forEach(tree => {
                domainColors[tree.name] = {
                    trunk: tree.palette?.trunk || '#39d3c3',
                    leaf: tree.palette?.leaf || '#f2c14e',
                    bg: tree.palette?.bg || '#07050d'
                };
            });
            
            updateOverviewStats();
        } catch (error) {
            console.error('Error loading manifest:', error);
            elements.canvas.innerHTML = '<div class="error">Failed to load forest manifest</div>';
        }
    }
    
    function updateOverviewStats() {
        if (!manifest) return;
        
        const statsContainer = document.getElementById('overview-stats');
        const totalDomains = manifest.domains.length;
        const totalTrees = manifest.trees.reduce((sum, t) => sum + (t.top_trees || 0), 0);
        
        // Load a sample atlas to get node counts
        let totalNodes = 0;
        let totalEdges = 0;
        
        // We'll load the first atlas to get real counts
        if (manifest.trees.length > 0) {
            try {
                const firstAtlas = manifest.trees[0];
                const response = await fetch(`data/${firstAtlas.atlas}`);
                if (response.ok) {
                    const atlas = await response.json();
                    totalNodes = atlas.totals?.nodes || 0;
                    totalEdges = atlas.totals?.edges || 0;
                }
            } catch (e) {
                console.warn('Could not load sample atlas for stats');
            }
        }
        
        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${totalDomains}</div>
                <div class="stat-label">Domains</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totalTrees}</div>
                <div class="stat-label">Top Trees</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totalNodes.toLocaleString()}</div>
                <div class="stat-label">Nodes (sample)</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totalEdges.toLocaleString()}</div>
                <div class="stat-label">Edges (sample)</div>
            </div>
        `;
    }
    
    function renderDomainCards() {
        if (!manifest || !elements.domainCards) return;
        
        elements.domainCards.innerHTML = manifest.trees.map(tree => `
            <article class="domain-card" data-domain="${tree.name}" tabindex="0">
                <div class="domain-name">${tree.name}</div>
                <div class="domain-label">${tree.label}</div>
                <div class="domain-description">${tree.note}</div>
            </article>
        `).join('');
        
        // Add click handlers
        document.querySelectorAll('.domain-card').forEach(card => {
            card.addEventListener('click', () => {
                const domain = card.dataset.domain;
                elements.domainSelect.value = domain;
                onDomainSelect();
            });
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }
    
    function populateDomainSelect() {
        if (!manifest || !elements.domainSelect) return;
        
        manifest.trees.forEach(tree => {
            const option = document.createElement('option');
            option.value = tree.name;
            option.textContent = `${tree.label} (${tree.name})`;
            elements.domainSelect.appendChild(option);
        });
    }
    
    function initForestCanvas() {
        if (!elements.canvas) return;
        
        const width = elements.canvas.clientWidth;
        const height = elements.canvas.clientHeight || 600;
        
        svg = d3.select(elements.canvas)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height]);
        
        // Add defs for gradients
        const defs = svg.append('defs');
        
        // Create main group for zoom/pan
        g = svg.append('g');
        
        // Add legend
        createLegend();
        
        // Show placeholder
        showPlaceholder();
    }
    
    function createLegend() {
        const legend = g.append('g')
            .attr('class', 'forest-legend')
            .attr('transform', 'translate(20, 20)');
        
        // We'll populate this when a domain is selected
    }
    
    function showPlaceholder() {
        if (!g) return;
        
        const width = elements.canvas.clientWidth;
        const height = elements.canvas.clientHeight || 600;
        
        g.append('text')
            .attr('class', 'placeholder-text')
            .attr('x', width / 2)
            .attr('y', height / 2)
            .attr('text-anchor', 'middle')
            .attr('fill', '#6b7280')
            .style('font-size', '1.2rem')
            .text('Select a domain from the dropdown to explore its forest');
    }
    
    function setupZoom() {
        zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });
        
        svg.call(zoom);
        
        // Double-click to reset
        svg.on('dblclick.zoom', resetView);
    }
    
    function createTooltip() {
        tooltip = d3.select('body')
            .append('div')
            .attr('class', 'forest-tooltip hidden')
            .style('position', 'absolute')
            .style('pointer-events', 'none');
    }
    
    async function onDomainSelect() {
        const domainName = elements.domainSelect.value;
        if (!domainName) {
            clearForest();
            showPlaceholder();
            return;
        }
        
        const treeConfig = manifest.trees.find(t => t.name === domainName);
        if (!treeConfig) return;
        
        await loadAtlas(treeConfig);
    }
    
    async function loadAtlas(treeConfig) {
        try {
            showLoading(treeConfig.label);
            
            const response = await fetch(`data/${treeConfig.atlas}`);
            if (!response.ok) throw new Error(`Failed to load ${treeConfig.atlas}`);
            
            currentAtlas = await response.json();
            
            // Update domain colors from this atlas if not in manifest
            if (currentAtlas.palette) {
                domainColors[treeConfig.name] = {
                    trunk: currentAtlas.palette.trunk,
                    leaf: currentAtlas.palette.leaf,
                    bg: currentAtlas.palette.bg
                };
            }
            
            renderForest(treeConfig);
            updateNodeCount();
            
        } catch (error) {
            console.error('Error loading atlas:', error);
            showError(`Failed to load ${treeConfig.label}: ${error.message}`);
        }
    }
    
    function showLoading(label) {
        g.selectAll('.placeholder-text, .loading-text').remove();
        
        const width = elements.canvas.clientWidth;
        const height = elements.canvas.clientHeight || 600;
        
        g.append('text')
            .attr('class', 'loading-text')
            .attr('x', width / 2)
            .attr('y', height / 2)
            .attr('text-anchor', 'middle')
            .attr('fill', '#9aa0aa')
            .style('font-size', '1.2rem')
            .text(`Loading ${label}...`);
    }
    
    function showError(message) {
        g.selectAll('.placeholder-text, .loading-text').remove();
        
        const width = elements.canvas.clientWidth;
        const height = elements.canvas.clientHeight || 600;
        
        g.append('text')
            .attr('class', 'error-text')
            .attr('x', width / 2)
            .attr('y', height / 2)
            .attr('text-anchor', 'middle')
            .attr('fill', '#e05a3c')
            .style('font-size', '1rem')
            .text(message);
    }
    
    function clearForest() {
        g.selectAll('.link, .node, .node-label, .loading-text, .placeholder-text, .error-text').remove();
        currentAtlas = null;
        selectedNode = null;
        closeNodeDetails();
    }
    
    function renderForest(treeConfig) {
        clearForest();
        
        if (!currentAtlas || !currentAtlas.trees) return;
        
        const width = elements.canvas.clientWidth;
        const height = elements.canvas.clientHeight || 600;
        
        // Use the first tree in the atlas (or merge all)
        const treeData = currentAtlas.trees[0];
        if (!treeData || !treeData.nodes) return;
        
        const nodes = treeData.nodes;
        const links = treeData.links || [];
        
        // Color scale for this domain
        const color = domainColors[treeConfig.name] || domainColors.sentinel;
        const trunkColor = color.trunk;
        const leafColor = color.leaf;
        
        // Create simulation
        simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(80).strength(0.5))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(d => Math.max(d.size || 4, 8) + 4).strength(0.7))
            .on('tick', ticked);
        
        // Render links
        const link = g.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('class', 'link')
            .attr('stroke-width', d => Math.sqrt(d.weight || 1))
            .attr('stroke-opacity', 0.3);
        
        // Render nodes
        const node = g.append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('class', d => `node-circle node-${d.domain || treeConfig.name}`)
            .attr('r', d => Math.max(d.size || 4, 4))
            .attr('fill', d => d.is_leaf ? leafColor : trunkColor)
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => showTooltip(event, d, treeConfig))
            .on('mouseout', hideTooltip)
            .on('click', (event, d) => showNodeDetails(d, treeConfig))
            .call(drag(simulation));
        
        // Render labels (only for larger nodes)
        const label = g.append('g')
            .attr('class', 'labels')
            .selectAll('text')
            .data(nodes.filter(d => (d.size || 0) > 6))
            .join('text')
            .attr('class', 'node-label')
            .text(d => d.name || d.id)
            .attr('font-size', '10px')
            .attr('fill', '#9aa0aa')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('pointer-events', 'none');
        
        // Update on tick
        function ticked() {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
            
            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
            
            label
                .attr('x', d => d.x)
                .attr('y', d => d.y);
        }
        
        // Update legend
        updateLegend(treeConfig);
    }
    
    function updateLegend(treeConfig) {
        const color = domainColors[treeConfig.name] || domainColors.sentinel;
        
        // Remove old legend
        g.selectAll('.forest-legend').remove();
        
        const legend = g.append('g')
            .attr('class', 'forest-legend')
            .attr('transform', 'translate(20, 20)');
        
        const items = [
            { label: 'Trunk / Core', color: color.trunk },
            { label: 'Leaf / Module', color: color.leaf },
            { label: 'Link', color: '#6b7280' }
        ];
        
        items.forEach((item, i) => {
            const row = legend.append('g')
                .attr('class', 'forest-legend-item')
                .attr('transform', `translate(0, ${i * 20})`);
            
            row.append('rect')
                .attr('class', 'forest-legend-color')
                .attr('width', 12)
                .attr('height', 12)
                .attr('fill', item.color);
            
            row.append('text')
                .attr('x', 18)
                .attr('y', 10)
                .attr('fill', '#e8eaf0')
                .style('font-size', '12px')
                .text(item.label);
        });
    }
    
    function updateNodeCount() {
        if (currentAtlas && currentAtlas.trees && currentAtlas.trees[0]) {
            const nodes = currentAtlas.trees[0].nodes;
            const links = currentAtlas.trees[0].links || [];
            elements.nodeCount.textContent = `${nodes.length} nodes, ${links.length} links`;
        }
    }
    
    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }
        
        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }
        
        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }
        
        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }
    
    function showTooltip(event, d, treeConfig) {
        const color = domainColors[treeConfig.name] || domainColors.sentinel;
        
        tooltip
            .classed('hidden', false)
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 10) + 'px')
            .html(`
                <div class="tooltip-title">${d.name || d.id}</div>
                <div class="tooltip-domain">${treeConfig.name}</div>
                <div class="tooltip-stat">
                    <span class="tooltip-stat-label">Type</span>
                    <span class="tooltip-stat-value">${d.is_leaf ? 'Leaf / Module' : 'Trunk / Core'}</span>
                </div>
                <div class="tooltip-stat">
                    <span class="tooltip-stat-label">Size</span>
                    <span class="tooltip-stat-value">${d.size || 'N/A'}</span>
                </div>
                <div class="tooltip-stat">
                    <span class="tooltip-stat-label">Classes</span>
                    <span class="tooltip-stat-value">${d.classes || 'N/A'}</span>
                </div>
                <div class="tooltip-stat">
                    <span class="tooltip-stat-label">Lines</span>
                    <span class="tooltip-stat-value">${(d.lines || 0).toLocaleString()}</span>
                </div>
            `);
        
        // Highlight node
        d3.select(event.target)
            .attr('stroke', '#fff')
            .attr('stroke-width', 3)
            .attr('filter', 'brightness(1.2)');
    }
    
    function hideTooltip(event, d) {
        tooltip.classed('hidden', true);
        
        d3.select(event.target)
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .attr('filter', null);
    }
    
    function showNodeDetails(d, treeConfig) {
        selectedNode = d;
        
        elements.detailTitle.textContent = d.name || d.id;
        
        let html = `
            <div class="detail-field"><strong>Domain:</strong> ${treeConfig.label} (${treeConfig.name})</div>
            <div class="detail-field"><strong>Type:</strong> ${d.is_leaf ? 'Leaf / Module' : 'Trunk / Core'}</div>
            <div class="detail-field"><strong>Size:</strong> ${d.size || 'N/A'}</div>
            <div class="detail-field"><strong>Classes:</strong> ${d.classes || 'N/A'}</div>
            <div class="detail-field"><strong>Lines:</strong> ${(d.lines || 0).toLocaleString()}</div>
            <div class="detail-field"><strong>Modules:</strong> ${d.modules || 'N/A'}</div>
        `;
        
        if (d.path) {
            html += `<div class="detail-field"><strong>Path:</strong> <code>${d.path}</code></div>`;
        }
        
        elements.detailContent.innerHTML = html;
        elements.nodeDetails.classList.remove('hidden');
    }
    
    function closeNodeDetails() {
        elements.nodeDetails.classList.add('hidden');
        selectedNode = null;
    }
    
    function resetView() {
        if (svg && zoom) {
            svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity
            );
        }
        closeNodeDetails();
    }
    
    // Public API
    return {
        init
    };
})();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ForestApp;
}