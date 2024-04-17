#ACCESSING VECTOR ELEMENTS
t <- c('sun','mon','tue','wed','thurs','fri','Sat')
print(t)

u <- t[c(2,3,6)]
print(u)

v<-t[c(TRUE,FALSE,TRUE,TRUE,FALSE,FALSE,TRUE)]
print(v)

x <- t[c(-2,-5)]
print(x)