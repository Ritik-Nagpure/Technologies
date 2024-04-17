
emp.data<- data.frame(
  emp.id=c(1:5),
  emp_name=c("Ram","shyam","Rita","Gita","Sita"),
  salary=c(4000,5000,6000,7000,2000),
  start_date=as.Date(c("2018-2-1","2015-3-2","2017-4-2","2012-2-7","2014-5-23")),
  dept = c("CEo","hardware","software","watchman","superviser"),
  stringsAsFactors = FALSE
)

print(emp.data)
emp.newdata <- data.frame(
  emp.id = c(6:8),
  emp_name = c("Ramesh","Suresh","Chetan"),
  salary = c(10000,12000,200),
  start_date = as.Date(c("2000-2-1","2000-1-1","1999-4-4")),
  dept = c("HR","IT","technician"),
  stringsAsFactors = FALSE
)

print(emp.newdata)
#BINDing THE DATA FRAME

emp.finaldata = rbind(emp.data,emp.newdata)
print(emp.finaldata)


