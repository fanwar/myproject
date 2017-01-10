'use strict';

var graphModule = require('../../ds/graph');
var UndirectedGraph = graphModule.UndirectedGraph;
var Vertex = graphModule.Vertex;
var Edge = graphModule.Edge; 
var utils = require("../utils.js");
var assert = require('chai').assert;
var expect = require('chai').expect; 

var Point = {
  x: null,
  y: null,
  create: function(x, y) {
    var newPoint = Object.create(Point);
    newPoint.x = x;
    newPoint.y = y;
    
    return newPoint; 
  },

  toString: function() {
    return `(${this.x}, ${this.y})`; 
  }
}


describe('UndirectedGraph', function() {
  var contentList; 
  var testVertices; 
  var edges; 
  
  beforeEach(function() {
    contentList = [
      Point.create(0, 0),
      Point.create(1, 0),
      Point.create(1, 1),
      Point.create(2, 3)
    ];
    
    testVertices = graphModule.createVerticesFromArray(contentList);
    edges = [
      Edge.create(testVertices[0], testVertices[1]),
      Edge.create(testVertices[0], testVertices[2]),
      Edge.create(testVertices[2], testVertices[3])
    ]; 
  }); 
  
  describe('create()', function() {    
    it('creates a new empty graph when no vertices or edges provided', function() {
      var graph = UndirectedGraph.create();
      expect(graph).not.to.be.null;
    });

    it('creates a properly initialized graph when initialized vertices provided', function() {
      var graph = UndirectedGraph.create(testVertices);
      expect(graph).not.to.be.null;
      expect(graph.vertexCount()).to.equal(testVertices.length); 
    });

    it('creates a property initialized graph with initial vertices and edges', function() {
      var graph = UndirectedGraph.create(testVertices, edges);
      expect(graph).not.to.be.null;
      expect(graph.vertexCount()).to.equal(testVertices.length);
      expect(graph.containsEdge(testVertices[0], testVertices[1])).to.be.true;
      expect(graph.containsEdge(testVertices[2], testVertices[3])).to.be.true;
      expect(graph.containsEdge(testVertices[1], testVertices[3])).to.be.false; 
      
    }); 
  });


  describe('addVertex()', function() {
    it('adds a new vertex and returns true when vertex is not in graph', function() {
      var graph = UndirectedGraph.create(testVertices, edges);
      var originalVertexCount = graph.vertexCount(); 
      var point = Point.create(5, 5);
      var newVertex = Vertex.create(point); 
      expect(graph.addVertex(newVertex)).to.be.true;
      expect(graph.vertexCount()).to.equal(originalVertexCount + 1);      
    });

    it('does not add a vertex when it is already in the graph', function() {
      var graph = UndirectedGraph.create(testVertices, edges);
      var originalVertexCount = graph.vertexCount();

      expect(graph.addVertex(testVertices[0])).to.be.false;
      expect(graph.vertexCount()).to.equal(originalVertexCount); 
    });
  });

  describe('edgeCount()', function() {
    it('returns 0 for graph with no edges', function() {
      var graph = UndirectedGraph.create();
      expect(graph.edgeCount()).to.equal(0);

      graph = UndirectedGraph.create(testVertices);
      expect(graph.edgeCount()).to.equal(0); 
    });

    it('returns 1 for graph with single edge', function() {
      var graph = UndirectedGraph.create(testVertices, [edges[0]]);
      expect(graph.edgeCount()).to.equal(1); 
    });

    it('returns correctly for graph with many edges', function() {
      var graph = UndirectedGraph.create(testVertices, edges);
      expect(graph.edgeCount()).to.equal(edges.length); 
    }); 
  }); 

  describe('addEdge()', function() {
    it('adds new edge correctly when it is not in graph', function() {
      var graph = UndirectedGraph.create(testVertices, edges);
      var originalEdgeCount = graph.edgeCount(); 
      var newEdge = Edge.create(testVertices[0], testVertices[3]);
      graph.addEdge(newEdge);
      expect(graph.containsEdge(testVertices[0], testVertices[3])).to.be.true;
      expect(graph.containsEdge(testVertices[3], testVertices[0])).to.be.true;
      expect(graph.edgeCount()).to.equal(originalEdgeCount + 1); 
    });

    it('does not add edge when it is already in graph', function() {
      var graph = UndirectedGraph.create(testVertices, edges);
      var originalEdgeCount = graph.edgeCount();
      graph.addEdge(Edge.create(testVertices[0], testVertices[1]));
      expect(graph.edgeCount()).to.equal(originalEdgeCount); 
    });

    it('throws error when adding edge with vertex not in graph', function() {
      var graph = UndirectedGraph.create(testVertices, edges);
      var badVertex = Vertex.create('dummy-content');
      var badVertex2 = Vertex.create('dummy-content2');
      var addEdgeFnCreator = function(vertex1, vertex2) {
        return function() {
          graph.addEdge(Edge.create(vertex1, vertex2)); 
        }; 
      }; 
      expect(addEdgeFnCreator(testVertices[0], badVertex)).to.throw(/must add vertices/);
      expect(addEdgeFnCreator(badVertex, testVertices[0])).to.throw(/must add vertices/);
      expect(addEdgeFnCreator(badVertex, badVertex2)).to.throw(/must add vertices/);
    }); 
  }); 
}); 
