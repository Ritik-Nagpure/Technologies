

x<-c(21,33,66,54)
lbl<-c('mumbai','Delhi','pune','Kolkata')
png(file='barchart.jpg')

barplot(x, xlab = 'city', ylab = 'ravenue', main = 'ravenue chart',
        col=c('blue','Red','yellow','magenta'),border='red')

dev.off()

barplot(x, xlab = 'city', ylab = 'ravenue', main = 'ravenue chart',
        col=c('blue','Red','yellow','magenta'),border='red')
