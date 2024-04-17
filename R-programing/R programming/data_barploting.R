x <- c(32,63,23,32)
labels <- c('mumbai','delhi','pune','kolkata')

png(file='barchart.jpg')
barplot(x,col=rainbow(x),main="barplot")
legend('topright', labels,cex = 0.7 , fill  = rainbow(x))
dev.off()
barplot(x,xlab='city', col=rainbow(x),main="barplot")
legend('topright', labels, cex = 0.7 , fill  = rainbow(x))