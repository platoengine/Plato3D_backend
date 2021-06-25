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
# renderView1.ViewSize = [1170, 836]

# show data in view
stepspvdDisplay = Show(stepspvd, renderView1)
# trace defaults for the display properties.
stepspvdDisplay.Representation = 'Surface'
stepspvdDisplay.ColorArrayName = [None, '']
stepspvdDisplay.OSPRayScaleArray = 'displacement'
stepspvdDisplay.OSPRayScaleFunction = 'PiecewiseFunction'
stepspvdDisplay.SelectOrientationVectors = 'displacement'
stepspvdDisplay.ScaleFactor = 0.9820216
stepspvdDisplay.SelectScaleArray = 'displacement'
stepspvdDisplay.GlyphType = 'Arrow'
stepspvdDisplay.GlyphTableIndexArray = 'displacement'
stepspvdDisplay.DataAxesGrid = 'GridAxesRepresentation'
stepspvdDisplay.PolarAxes = 'PolarAxesRepresentation'
stepspvdDisplay.ScalarOpacityUnitDistance = 0.2979253174897762

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
extractSurface1Display.OSPRayScaleArray = 'displacement'
extractSurface1Display.OSPRayScaleFunction = 'PiecewiseFunction'
extractSurface1Display.SelectOrientationVectors = 'displacement'
extractSurface1Display.ScaleFactor = 0.9820216
extractSurface1Display.SelectScaleArray = 'displacement'
extractSurface1Display.GlyphType = 'Arrow'
extractSurface1Display.GlyphTableIndexArray = 'displacement'
extractSurface1Display.DataAxesGrid = 'GridAxesRepresentation'
extractSurface1Display.PolarAxes = 'PolarAxesRepresentation'

# hide data in view
Hide(stepspvd, renderView1)

# update the view to ensure updated data information
renderView1.Update()

# set scalar coloring
ColorBy(extractSurface1Display, ('POINTS', 'displacement', 'Magnitude'))

# rescale color and/or opacity maps used to include current data range
extractSurface1Display.RescaleTransferFunctionToDataRange(True, False)

# show color bar/color legend
extractSurface1Display.SetScalarBarVisibility(renderView1, True)

# get color transfer function/color map for 'displacement'
displacementsLUT = GetColorTransferFunction('displacement')

# set scalar coloring
ColorBy(extractSurface1Display, ('POINTS', 'displacement', 'X'))

# rescale color and/or opacity maps used to exactly fit the current data range
extractSurface1Display.RescaleTransferFunctionToDataRange(False, False)

# Update a scalar bar component title.
UpdateScalarBarsComponentTitle(displacementsLUT, extractSurface1Display)

# Properties modified on extractSurface1Display
extractSurface1Display.MapScalars = 0

# save data
SaveData(outFileName, proxy=extractSurface1, FileType='Ascii', EnableColoring=1,
    ColorArrayName=['POINTS', 'displacement'],
    LookupTable=displacementsLUT)

#### saving camera placements for all active views

# current camera placement for renderView1
renderView1.CameraPosition = [1.770185, 1.5, 21.37134061972511]
renderView1.CameraFocalPoint = [1.770185, 1.5, 1.0]
renderView1.CameraParallelScale = 5.272490926655446

#### uncomment the following to render all views
# RenderAllViews()
# alternatively, if you want to write images, you can use SaveScreenshot(...).
