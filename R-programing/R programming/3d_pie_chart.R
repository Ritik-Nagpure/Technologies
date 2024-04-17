#library(plotrix)
x <- c(21,35,46,63)
lbls <- c('mumbai','delhi','pune','kolkata')

png(file='pie3D.jpg')
pie3D(x,labels=lbls,explode=0,main='city pie chart')
dev.off()
pie3D(x,labels=lbls,explode=0,main='city pie chart')

