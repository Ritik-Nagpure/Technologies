import logging
import os

filepath = os.getcwd() + "\\FileSystemDB\\folder1\\logfile.log"
#os.chdir(filepath)
print(filepath)

logging.basicConfig(filename=filepath,level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
#logging.disable(logging.INFO)  # disables logging BELOW THE MENTIONED LEVEL
'''
levels of logging from low to high
logging.debug()  # ==> least important
logging.info()
logging.warning()
logging.error()
logging.critical() # ==> most important
'''

logging.debug('start of program')
def factorial(n):
    logging.error('start of function')
    logging.info('value supplied is %s' % n)
    total = 1
    for i in range(1,n+1):
        total *= i
        logging.debug('factorial Calculated is %s' % total)
    return total

logging.warning('calling function factorial')
print(factorial(4))
logging.critical('end of program')
