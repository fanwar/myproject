'use strict'

var _ = require('lodash'); 

// Helper method that takes an array of content and creates vertices
// for each content. Returns an array of vertices. 
function createVerticesFromArray(arr) {
  return arr.map(function(item) {
    return Vertex.create(item); 
  }); 
}


var Vertex = {
  content: null,
  create: function(content) {
    let newVertex = Object.create(Vertex);
    newVertex.content = content;
    return newVertex; 
  },

  toString: function() {
    return `Vertex<Content:${this.content.toString()}>`; 
  }
};

// Edge is just an ordered tuple of vertices. It is used more as a helper currently
// to pair together vertices since we actually represent edges using adjacency lists
// in UndirectedGraph
var Edge = {
  source: null,
  sink: null,
  create: function(source, sink) {
    var newEdge = Object.create(Edge);
    newEdge.source = source;
    newEdge.sink = sink;
    return newEdge; 
  }
}; 

var UndirectedGraph = {
  /**
     An implementation of undirected graph. Maintains two hashmaps - one for the vertices
     in the graph, and another for the edges. Note that Javascript dictionaries only map
     with String keys, so a single map from vertex -> adjacent vertices is not possible. 
     Instead, vertices maps string representation of vertex to the Vertex object itself. 
     The edges map is from string representation of vertex to hashmap containing the
     adjacent vertices. Assumption is that the vertex & its content create a unique string
     via their toString() methods. 
   */
  
  vertices: null,

  // edges is a map from string representation to dictionary.
  // The dictionary itself maps string representations of vertices
  // to some non-false value.
  // eg. below represents edges between (vertex1,vertex2), (vertex1, vertex3) and (vertex4, vertex5)
  // edges: {
  //   vertex1: { vertex2: {}, vertex3: {} }
  //   vertex2: { vertex1: {} }
  //   vertex3: { vertex1: {} }
  //   vertex4: { vertex5: {} }
  //   vertex5: { vertex4: {} }
  // }
  edges: null, 


  // Creates a new Graph and initializes it with the given vertices and edges. 
  create: function(vertices, edges) {
    let newGraph = Object.create(UndirectedGraph);
    newGraph.vertices = {};
    newGraph.edges = {};
    if (vertices) {
      vertices.forEach(function(vertex) {
        newGraph.addVertex(vertex); 
      }); 
    }

    // Add edges
    if (edges) {
      edges.forEach(function(edge) {
        newGraph.addEdge(edge); 
      }); 
    }
 
    return newGraph; 
  },

  /**
     Adds the given vertex to the graph, if it doesn't already exists. 
     @param vertex: A Vertex to add
     @return: true if vertex was added, false if not (due to error or because it already 
       existed in graph). 
   */ 
  addVertex: function(vertex) {
    if (!(vertex in this.vertices)) {
      this.vertices[vertex] = vertex;
      this.edges[vertex] = {}; 
      return true; 
    }
    return false; 
  },

  // Removes the given `vertex` and all incident edges to
  // it from the graph. 
  removeVertex: function(vertex) {
    this.removeAllEdges(vertex);
    delete this.edges[vertex];  // Empty dictionary at this point. 
    delete this.vertices[vertex]; 
  },

  containsVertex: function(vertex) {
    return vertex in this.vertices; 
  },

  // Returns a list of all the vertices in this graph
  getVertices: function() {
    return _.values(this.vertices); 
  },

  vertexCount: function() {
    return this.getVertices().length; 
  },

  addEdge: function(edge) {
    var sourceVertex = edge.source;
    var sinkVertex = edge.sink;
    
    if (!(sourceVertex in this.vertices) || !(sinkVertex in this.vertices)) {
      throw 'Error: must add vertices to graph before creating edge between them!';
    }

    this.edges[sourceVertex][sinkVertex] = {};
    this.edges[sinkVertex][sourceVertex] = {}; 
  },

  removeEdge: function(vertex1, vertex2) {
    delete this.edges[vertex1][vertex2];
    delete this.edges[vertex2][vertex1]; 
  },

  //Returns the number of *undirected* edges in the graph.
  edgeCount: function() {
    var totalDirectedEdges = _.reduce(this.edges, function(totalEdges, edgesFromVertex, vertexStr) {
      return totalEdges + _.keys(edgesFromVertex).length; 
    }, 0);

    return totalDirectedEdges / 2; 
  },

  // Removes all edges between the given `vertex` and other vertices in the graph
  removeAllEdges: function(vertex) {
    _.keys(this.edges[vertex]).forEach(function(sinkVertexKey) {
      // Remove each edge.
      this.removeEdge(vertex, this.vertices[sinkVertexKey]); 
    });
  },

  // Detects if there is an edge between vertex1 & vertex2. Returns true
  // if there is, false otherwise. 
  containsEdge: function(vertex1, vertex2) {
    return (vertex2 in this.edges[vertex1]); 
  }


}; 

module.exports.Edge = Edge; 
module.exports.Vertex = Vertex; 
module.exports.UndirectedGraph = UndirectedGraph;
module.exports.createVerticesFromArray = createVerticesFromArray; 
