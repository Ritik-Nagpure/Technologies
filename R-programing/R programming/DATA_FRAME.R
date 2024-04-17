#R PROGRAMMING
# DATA FRAME
#SYNTAX data.frame()
# TO CREATE EMPLOYEE DATA
emp.data<- data.frame(
  emp.id=c(1:5),
  emp_name=c("Ram","shyam","Rita","Gita","Sita"),
  salary=c(4000,5000,6000,7000,2000),
  star_date=as.Date(c("2018-2-1","2015-3-2","2017-4-2","2012-2-7","2014-5-23")),
  stringsAsFactors = FALSE
  )

print(emp.data)

str(emp.data)
print(summary(emp.data))
