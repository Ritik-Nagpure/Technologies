x<-c(9,4,33,77,44,66,5,77,88,5,6)

png(file='histo.jpg')

hist(x,xlab='marks',col='green',border='red')

dev.off()

hist(x,xlab='marks',col='light blue',border='red')