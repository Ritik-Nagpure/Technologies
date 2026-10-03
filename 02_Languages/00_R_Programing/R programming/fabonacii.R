#r script
#WAP to print fabonacci series
fibo<-function(a){
  var1=0
  var2=1
  print(var1)
  #print(var2)
  for(x in 1:a){
    var3=var1+var2
    print(var3)
    var1=var2
    var2=var3
  }
}

# to call the function write fibo("value of a") in console or code

if(FALSE){
  " another method o print fabonacci series 
  
  a=0
  b=1
  print(b)
  c=0
  while(c<31)
  {
  c=a+b
  print(c)
  a=b
  b=c
  }
  "
  
}