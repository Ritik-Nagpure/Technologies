if(FALSE){
  'type=" o/l/p "    
  these means ploting graph shows only points if p is written in inside
  type and plots lines if written l and both if written o inside type'
  
  "to add more lines in smae graph just type lines(....,type='' )"
}


x<-c(10,44,5,67,35)

png(file='line chart.jpg')

plot(x,type='o')

dev.off()

plot(x,type='o',col='orange',xlab = 'marvel',ylab = 'DC')

t<-c(22,30,43,66,44)
lines(t,type='o',col='red')