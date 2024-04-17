 #create a function to add multiply substract divide
add<-function(a,b){
  ans=a+b
  print(ans)
}

sub<-function(a,b){
  ans=a-b
  print(ans)
}

mul<-function(a,b){
  ans=a*b
  print(ans)
}

div<-function(a,b){
  ans=a/b
  print(ans)
}

print('select operation')
print('1] add')
print('2] subtract')
print('3] multiply')
print('4] divide')

choise=as.integer(readline(prompt = 'enter choise[1/2/3/4] : '))

if((0<choise) & (choise<5))
  {
  a=as.integer(readline(prompt = 'enter first number = '))
  b=as.integer(readline(prompt = ' enter second number = '))
  
  operator<- switch(choise,'+','-','*','/')
  
  result<-switch(choise,add(a,b),sub(a,b),mul(a,b),div(a,b))
  
  print(paste(a,operator,b,'=',result))
}

if(choise<0 || choise>4)
{
  print('invalid input')
}
