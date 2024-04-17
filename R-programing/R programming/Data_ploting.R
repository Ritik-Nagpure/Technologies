#PRE CHARTS IN R
# TO CREATE A DATA
x <- c(21,35,46,63)
labels <- c('mumbai','delhi','pune','kolkata')

#GIVE THE CHART FILE A NAME
png(file='city.jpg')

#PLOT THE CHART
pie(x,labels)

# SAVE THE FILE
dev.off()
pie(x,labels)

png(file='city_color.jpg')
pie(x,labels,main = 'city pie chart',col=rainbow(length(x)))
dev.off()
pie(x,labels,main = 'city pie chart',col=rainbow(length(x)))

png(file='city_color.jpg')
pie(x,labels,main = 'city pie chart',col=c('pink','red','green','blue'))
dev.off()
pie(x,labels,main = 'city pie chart',col=c('pink','red','green','blue'))


piepercent <- round(100*x/sum(x))
png(file ='city_percent')

pie(x,labels=piepercent,main='city pie chart',col = rainbow(length(x)))
legend('topright',c('mumbai','delhi','pune','kolkata'),cex=0.8,fill=rainbow(length(x)))

dev.off()

pie(x,labels=piepercent,main='city pie chart',col = rainbow(length(x)))

legend('topright',c('mumbai','delhi','pune','kolkata'),cex=0.8,fill=rainbow(length(x)))


