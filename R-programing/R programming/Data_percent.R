

png(file='city_color.jpg')
pie(x,labels,main = 'city pie chart',col=rainbow(length(x)))
dev.off()
pie(x,labels,main = 'city pie chart',col=rainbow(length(x)))

piepercent <- round(100*x/sum(x))
png(file ='city_percent')

pie(x,labels=piepercent,main='city pie chart',col = rainbow(length(x)))
legend('topright',c('mumbai','delhi','pune','kolkata'),cex=0.8,fill=rainbow(length(x)))

dev.off()

pie(x,labels=piepercent,main='city pie chart',col = rainbow(length(x)))

legend('topright',c('mumbai','delhi','pune','kolkata'),cex=0.8,fill=rainbow(length(x)))

