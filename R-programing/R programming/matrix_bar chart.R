#
x<-matrix(c(3,5,8,20,6,12,4,8,16,4,5,5),
          nrow=3,ncol=4,byrow=FALSE)

city<-c('mumbai','Delhi','kolkata','pune')
colr<-c('red','green','blue')
region<-c('north','west','East')

png(file='city_bar.jpg')

barplot(x,names.arg = city, main = 'revenue chart', xlab='city', ylab='revenue', col=colr)
legend('topright',region,cex=0.7,fill=colr)

dev.off()
barplot(x,names.arg = city, main = 'revenue chart', xlab='city', ylab='revenue', col=colr)
legend('topright',region,cex=0.7,fill=colr)

