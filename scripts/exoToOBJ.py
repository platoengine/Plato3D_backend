from sortedcontainers import SortedDict
from sortedcontainers import SortedList
import os
import subprocess
import trimesh
import exodus
import math
import sys

filename = sys.argv[1]
workingdir = sys.argv[2]

tetFaceMap = [[0, 1, 3],[1, 2, 3],[2, 0, 3],[0, 2, 1]]

def extractNodeSet(mesh, nodeset, gMap):
  """
  Extracts a set of points and tris from given a nodeset

  Arguments:
  nodeset -- exodus NodeSet object

  Returns: [points, tris, name]
  """

  X = mesh.coordinates[0]
  Y = mesh.coordinates[1]
  Z = mesh.coordinates[2]

  ## create SortedList of nodes for fast searching
  sortedNodes = SortedList()
  for node in nodeset.nodes:
    sortedNodes.add(node)

  totalNumPoints = 0
  points = []
  tris = []
  for p0 in sortedNodes:
    if p0 in gMap:
      for p1 in gMap[p0]:
        if sortedNodes.count(p1) != 0:
          for p2 in gMap[p0][p1]:
            if sortedNodes.count(p2) != 0:
              face = gMap[p0][p1][p2][0]
              iBlck = face[0]
              iElem = face[1]
              iFace = face[2]
              block = mesh.elementBlocks[iBlck]
              elemConn = block.Connectivity(iElem)
              faceConn = tetFaceMap[iFace]
              faceIndices = [elemConn[i] for i in faceConn]
              P0 = faceIndices[0]
              P1 = faceIndices[1]
              P2 = faceIndices[2]
              newFace = []
              points.append([ X[P0], Y[P0], Z[P0] ])
              newFace.append(totalNumPoints)
              totalNumPoints+=1
              points.append([ X[P1], Y[P1], Z[P1] ])
              newFace.append(totalNumPoints)
              totalNumPoints+=1
              points.append([ X[P2], Y[P2], Z[P2] ])
              newFace.append(totalNumPoints)
              totalNumPoints+=1
              tris.append(newFace)

  return {"points": points, "tris": tris, "name": nodeset.name}


def extractSideSet(mesh, sideset):
  """
  Extracts a set of points and tris from given a sideset

  Arguments:
  sideset -- exodus SideSet object

  Returns: [points, tris, name]
  """

  elems = sideset.elems
  sides = sideset.sides

  X = mesh.coordinates[0]
  Y = mesh.coordinates[1]
  Z = mesh.coordinates[2]


  points = []
  tris = []
  totalNumPoints = 0
  for iface in range(len(elems)):

    block_index = 0
    elem_index = elems[iface]-1
    for block in mesh.elementBlocks:
      elem_index -= block.numElements
      block_index += 1
      if elem_index <  0:
        elem_index += block.numElements
        block_index -= 1
        break

    elemConn = mesh.elementBlocks[block_index].Connectivity(elem_index)

    gids = [elemConn[localNodeIndex] for localNodeIndex in tetFaceMap[sides[iface]-1]]
    newFace = []
    for gid in gids:
      points.append([ X[gid], Y[gid], Z[gid] ])
      newFace.append(totalNumPoints)
      totalNumPoints+=1
    tris.append(newFace)

  return {"points": points, "tris": tris, "name": sideset.name}


def extractBlock(mesh, iBlock, gMap):

  block = mesh.elementBlocks[iBlock]
  numElems = block.numElements
  for iElem in range(numElems):

    tetFaceMap = [[0, 1, 3],[1, 2, 3],[2, 0, 3],[0, 2, 1]]

    elemConn = block.Connectivity(iElem)
    for iFace in range(len(tetFaceMap)):
      face = tetFaceMap[iFace]
      faceIndices = [elemConn[i] for i in face]
      faceIndices.sort()
      p0 = faceIndices[0]
      p1 = faceIndices[1]
      p2 = faceIndices[2]
      if p0 not in gMap:
        gMap[p0] = SortedDict()

      if p1 not in gMap[p0]:
        gMap[p0][p1] = SortedDict()

      if p2 not in gMap[p0][p1]:
        gMap[p0][p1][p2] = [[iBlock, iElem, iFace]]
      else:
        gMap[p0][p1][p2].append([iBlock, iElem, iFace])

  X = mesh.coordinates[0]
  Y = mesh.coordinates[1]
  Z = mesh.coordinates[2]

  totalNumPoints = 0
  points = []
  tris = []
  for p0 in gMap:
    for p1 in gMap[p0]:
      for p2 in gMap[p0][p1]:
        searchFaces = gMap[p0][p1][p2]
        face = []
        if len(searchFaces) == 1 and searchFaces[0][0] == iBlock:  ## surface face
          face = searchFaces[0]
        if len(searchFaces) == 2 and searchFaces[0][0] != searchFaces[1][0]:  ## boundary face
          if searchFaces[0][0] == iBlock:
            face = searchFaces[0] 
          elif searchFaces[1][0] == iBlock:
            face = searchFaces[1]
        if len(face) != 0:
          iElem = face[1]
          iFace = face[2]
          elemConn = block.Connectivity(iElem)
          faceConn = tetFaceMap[iFace]
          faceIndices = [elemConn[i] for i in faceConn]
          P0 = faceIndices[0]
          P1 = faceIndices[1]
          P2 = faceIndices[2]
          newFace = []
          points.append([ X[P0], Y[P0], Z[P0] ])
          newFace.append(totalNumPoints)
          totalNumPoints+=1
          points.append([ X[P1], Y[P1], Z[P1] ])
          newFace.append(totalNumPoints)
          totalNumPoints+=1
          points.append([ X[P2], Y[P2], Z[P2] ])
          newFace.append(totalNumPoints)
          totalNumPoints+=1
          tris.append(newFace)

  name = "block_" + str(block.Id)
  return {"points": points, "tris": tris, "name": name}

mesh = exodus.ExodusDB()
mesh.read(filename)

for sideset in mesh.SideSets:
  entity = extractSideSet(mesh, sideset)
  triMesh = trimesh.Trimesh(vertices=entity["points"], faces=entity["tris"])
  trimesh.exchange.export.export_mesh(triMesh, workingdir+entity["name"]+".obj", 'obj')
  print "sideset:" + workingdir+entity["name"] + ".obj"

gMap = SortedDict()

for iBlock in range(len(mesh.elementBlocks)):
  entity = extractBlock(mesh, iBlock, gMap)
  triMesh = trimesh.Trimesh(vertices=entity["points"], faces=entity["tris"])
  trimesh.exchange.export.export_mesh(triMesh, workingdir+entity["name"]+".obj", 'obj')
  print "block:" + workingdir+entity["name"] + ".obj"

for nodeset in mesh.NodeSets:
  entity = extractNodeSet(mesh, nodeset, gMap)
  triMesh = trimesh.Trimesh(vertices=entity["points"], faces=entity["tris"])
  trimesh.exchange.export.export_mesh(triMesh, workingdir+entity["name"]+".obj", 'obj')
  print "nodeset:" + workingdir+entity["name"] + ".obj"
