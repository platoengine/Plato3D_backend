#### import the simple module from the paraview
from paraview.simple import *
import sys

inFileName = sys.argv[1]
outFileName = sys.argv[2]

#### disable automatic camera reset on 'Show'
paraview.simple._DisableFirstRenderCameraReset()

# create a new 'PVD Reader'
stepspvd = PVDReader(FileName=inFileName)

# get active view
renderView1 = GetActiveViewOrCreate('RenderView')
# uncomment following to set a specific view size
# renderView1.ViewSize = [693, 670]

# show data in view
stepspvdDisplay = Show(stepspvd, renderView1)
# trace defaults for the display properties.
stepspvdDisplay.Representation = 'Surface'
stepspvdDisplay.ColorArrayName = [None, '']
stepspvdDisplay.OSPRayScaleArray = 'class_dim'
stepspvdDisplay.OSPRayScaleFunction = 'PiecewiseFunction'
stepspvdDisplay.SelectOrientationVectors = 'None'
stepspvdDisplay.ScaleFactor = 0.5
stepspvdDisplay.SelectScaleArray = 'None'
stepspvdDisplay.GlyphType = 'Arrow'
stepspvdDisplay.GlyphTableIndexArray = 'None'
stepspvdDisplay.DataAxesGrid = 'GridAxesRepresentation'
stepspvdDisplay.PolarAxes = 'PolarAxesRepresentation'
stepspvdDisplay.ScalarOpacityUnitDistance = 0.1805735174025806

# reset view to fit data
renderView1.ResetCamera()

# update the view to ensure updated data information
renderView1.Update()

# create a new 'Extract Surface'
extractSurface1 = ExtractSurface(Input=stepspvd)

# show data in view
extractSurface1Display = Show(extractSurface1, renderView1)
# trace defaults for the display properties.
extractSurface1Display.Representation = 'Surface'
extractSurface1Display.ColorArrayName = [None, '']
extractSurface1Display.OSPRayScaleArray = 'class_dim'
extractSurface1Display.OSPRayScaleFunction = 'PiecewiseFunction'
extractSurface1Display.SelectOrientationVectors = 'None'
extractSurface1Display.ScaleFactor = 0.5
extractSurface1Display.SelectScaleArray = 'None'
extractSurface1Display.GlyphType = 'Arrow'
extractSurface1Display.GlyphTableIndexArray = 'None'
extractSurface1Display.DataAxesGrid = 'GridAxesRepresentation'
extractSurface1Display.PolarAxes = 'PolarAxesRepresentation'

# hide data in view
Hide(stepspvd, renderView1)

# update the view to ensure updated data information
renderView1.Update()

# set scalar coloring
ColorBy(extractSurface1Display, ('POINTS', 'temperature'))

# rescale color and/or opacity maps used to include current data range
extractSurface1Display.RescaleTransferFunctionToDataRange(True, False)

# show color bar/color legend
extractSurface1Display.SetScalarBarVisibility(renderView1, True)

# get color transfer function/color map for 'temperature'
temperatureLUT = GetColorTransferFunction('temperature')

# save data
SaveData(outFileName, proxy=extractSurface1, FileType='Ascii',
    EnableColoring=1,
    ColorArrayName=['POINTS', 'temperature'],
    LookupTable=temperatureLUT)

#### saving camera placements for all active views

# current camera placement for renderView1
renderView1.CameraPosition = [0.0, 0.0, 14.838834106713499]
renderView1.CameraParallelScale = 3.840572873934304

#### uncomment the following to render all views
# RenderAllViews()
# alternatively, if you want to write images, you can use SaveScreenshot(...).