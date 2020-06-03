#### import the simple module from the paraview
from paraview.simple import *
import sys
import os
import subprocess
sourceExo = os.path.abspath(sys.argv[1])
destinationBase = os.path.abspath(sys.argv[2])
print destinationBase
print sourceExo

#### disable automatic camera reset on 'Show'
paraview.simple._DisableFirstRenderCameraReset()

# create a new 'ExodusIIReader'
platomainexo = ExodusIIReader(FileName=[sourceExo])
platomainexo.PointVariables = []

# get animation scene
animationScene1 = GetAnimationScene()

# update animation scene based on data timesteps
animationScene1.UpdateAnimationUsingDataTimeSteps()

# Properties modified on platomainexo
platomainexo.PointVariables = ['Topology']
platomainexo.ElementBlocks = ['Unnamed block ID: 1 Type: HEX8']

# get active view
renderView1 = GetActiveViewOrCreate('RenderView')
# uncomment following to set a specific view size
# renderView1.ViewSize = [637, 547]

# show data in view
platomainexoDisplay = Show(platomainexo, renderView1)
# trace defaults for the display properties.
platomainexoDisplay.Representation = 'Surface'
platomainexoDisplay.ColorArrayName = [None, '']
platomainexoDisplay.OSPRayScaleArray = 'GlobalNodeId'
platomainexoDisplay.OSPRayScaleFunction = 'PiecewiseFunction'
platomainexoDisplay.SelectOrientationVectors = 'GlobalNodeId'
platomainexoDisplay.ScaleFactor = 10.0
platomainexoDisplay.SelectScaleArray = 'GlobalNodeId'
platomainexoDisplay.GlyphType = 'Arrow'
platomainexoDisplay.GlyphTableIndexArray = 'GlobalNodeId'
platomainexoDisplay.DataAxesGrid = 'GridAxesRepresentation'
platomainexoDisplay.PolarAxes = 'PolarAxesRepresentation'
platomainexoDisplay.ScalarOpacityUnitDistance = 2.839427553391603

# reset view to fit data
renderView1.ResetCamera()

# update the view to ensure updated data information
renderView1.Update()

# set scalar coloring
ColorBy(platomainexoDisplay, ('POINTS', 'Topology'))

# rescale color and/or opacity maps used to include current data range
platomainexoDisplay.RescaleTransferFunctionToDataRange(True, False)

# show color bar/color legend
platomainexoDisplay.SetScalarBarVisibility(renderView1, True)

# get color transfer function/color map for 'Topology'
topologyLUT = GetColorTransferFunction('Topology')

# create a new 'Iso Volume'
isoVolume1 = IsoVolume(Input=platomainexo)
isoVolume1.InputScalars = ['POINTS', 'GlobalNodeId']
isoVolume1.ThresholdRange = [1.0, 238328.0]

# Properties modified on isoVolume1
isoVolume1.InputScalars = ['POINTS', 'Topology']
isoVolume1.ThresholdRange = [0.5, 1.2]

# show data in view
isoVolume1Display = Show(isoVolume1, renderView1)
# trace defaults for the display properties.
isoVolume1Display.Representation = 'Surface'
isoVolume1Display.ColorArrayName = [None, '']
isoVolume1Display.OSPRayScaleFunction = 'PiecewiseFunction'
isoVolume1Display.SelectOrientationVectors = 'None'
isoVolume1Display.ScaleFactor = -2.0000000000000002e+298
isoVolume1Display.SelectScaleArray = 'None'
isoVolume1Display.GlyphType = 'Arrow'
isoVolume1Display.GlyphTableIndexArray = 'None'
isoVolume1Display.DataAxesGrid = 'GridAxesRepresentation'
isoVolume1Display.PolarAxes = 'PolarAxesRepresentation'

# hide data in view
Hide(platomainexo, renderView1)

# update the view to ensure updated data information
renderView1.Update()

# Properties modified on isoVolume1Display
isoVolume1Display.OSPRayScaleArray = 'Topology'

animationScene1.GoToLast()

# create a new 'Extract Surface'
extractSurface1 = ExtractSurface(Input=isoVolume1)

# show data in view
extractSurface1Display = Show(extractSurface1, renderView1)
# trace defaults for the display properties.
extractSurface1Display.Representation = 'Surface'
extractSurface1Display.ColorArrayName = [None, '']
extractSurface1Display.OSPRayScaleArray = 'Topology'
extractSurface1Display.OSPRayScaleFunction = 'PiecewiseFunction'
extractSurface1Display.SelectOrientationVectors = 'None'
extractSurface1Display.ScaleFactor = 9.952308654785156
extractSurface1Display.SelectScaleArray = 'None'
extractSurface1Display.GlyphType = 'Arrow'
extractSurface1Display.GlyphTableIndexArray = 'None'
extractSurface1Display.DataAxesGrid = 'GridAxesRepresentation'
extractSurface1Display.PolarAxes = 'PolarAxesRepresentation'

# hide data in view
Hide(isoVolume1, renderView1)

# update the view to ensure updated data information
renderView1.Update()

# save data
SaveData(destinationBase+".ply", proxy=extractSurface1, FileType='Ascii',
    EnableColoring=1,
    ColorArrayName=['POINTS', ''],
    LookupTable=None)

#### saving camera placements for all active views

# current camera placement for renderView1
renderView1.CameraPosition = [-54.81198278038593, 230.90649917435687, 311.24473401236014]
renderView1.CameraFocalPoint = [49.99999999999998, 49.99999999999998, 49.99999999999998]
renderView1.CameraViewUp = [0.08625182257299707, 0.8349247748409452, -0.5435634677382516]
renderView1.CameraParallelScale = 86.60254037844386

#### uncomment the following to render all views
# RenderAllViews()
# alternatively, if you want to write images, you can use SaveScreenshot(...).

subprocess.call(["meshlabserver", "-i", destinationBase+"0.ply", "-o", destinationBase+".obj"])
subprocess.call(["obj2gltf", "-i", destinationBase+".obj"])
