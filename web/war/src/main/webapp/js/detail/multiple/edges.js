define([
    'flight/lib/component',
    'flight/lib/registry',
    'tpl!./edges',
    '../withTypeContent',
    'util/edge/list',
    'util/vertex/formatters',
    'util/withDataRequest'
], function(
    defineComponent,
    registry,
    template,
    withTypeContent,
    EdgeList,
    F,
    withDataRequest) {
    'use strict';

    return defineComponent(MultipleEdges, withTypeContent, withDataRequest);

    function MultipleEdges() {
        var d3;

        this.defaultAttrs({
            edgeListSelector: '.edges-list'
        });

        this.after('initialize', function() {
            var self = this,
                edges = this.attr.data.edges || [],
                edgeIds = _.pluck(edges, 'id');

            this.displayingIds = edgeIds;

            this.on('selectObjects', this.onSelectObjects);

            Promise.all([
                Promise.require('d3'),
                this.dataRequest('edge', 'store', { edgeIds: edgeIds }),
                this.dataRequest('ontology', 'ontology')
            ]).done(function(results) {
                var _d3 = results.shift(),
                    edges = results.shift(),
                    ontology = results.shift(),
                    concepts = ontology.concepts,
                    properties = ontology.properties,
                    relationships = ontology.relationships;
                    ontologyRelation = relationships.byTitle[edges[0].label];

                d3 = _d3;

                self.$node.html(template({
                    F: F,
                    label: ontologyRelation && ontologyRelation.displayName || '',
                    edges: edges
                }));

                EdgeList.attachTo(self.select('edgeListSelector'), {
                    edges: edges
                })
            });

        });

        this.onSelectObjects = function(event, data) {
            event.stopPropagation();
            var $edgesList = this.$node.find('.edges-list'),
                height = _.reduce(
                    $edgesList.find('li.edge').toArray(),
                     function(sum, el) {
                         return sum + $(el).height();
                     }, 0
                ),
                calculatedHeight = Math.min(200, height + 4);

            this.$node.find('.details-container').css('bottom', calculatedHeight + 'px');
            $edgesList.hide().height(calculatedHeight + 'px');

            this.$node.find('.multiple').addClass('viewing-vertex');

            var self = this,
                detailsContainer = this.$node.find('.details-container'),
                detailsContent = detailsContainer.find('.content').teardownAllComponents();

            if (data && data.edgeIds && data.edgeIds.length) {
                if (_.isArray(data.edgeIds)) {
                    data.edgeIds = [data.edgeIds[0]];
                } else {
                    data.edgeIds = [data.edgeIds];
                }
                promise = this.dataRequest('edge', 'store', { edgeIds: data.edgeIds });
            } else {
                promise = Promise.resolve(data && data.edges || []);
            }
            promise.done(function(edges) {
                if (edges.length === 0) {
                    return;
                }

                var first = edges[0];
                if (self._selectedEdgeId === first.id) {
                    self.$node.find('.multiple').removeClass('viewing-vertex');
                    self.$node.find('.edges-list').show().find('.active').removeClass('active');
                    self._selectedEdgeId = null;
                    return;
                }

                self._selectedEdgeId = first.id;
                require(['detail/edge/edge'], function(Module) {
                    Module.attachTo(detailsContent, {
                        data: first
                    });
                    self.$node.find('.edges-list').show();
                });
            });
        };

    }
});
