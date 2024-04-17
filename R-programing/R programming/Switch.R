# R programing
#rscript

a=as.integer(readline(prompt="enter a : "))

switch(a,
       
       '1'=print('monday'),
       '2'=print('tuesday'),
       '3'=print('wednesday'),
       '4'=print('thursday'),
       '5'=print('friday'),
       '6'=print('saturday'),
       '7'=print('sunday'),
         print("invalid input")
)

