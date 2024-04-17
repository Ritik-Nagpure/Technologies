# function which return reverse of a string
 
def isPalindrome(s):
    return s == s[::-1]
 
 
# Driver code
s = input("enter here: ")
ans = isPalindrome(s)
 
if ans:
    print("Yes")
else:
    print("No")

if(False):
    # palindrome or not 
    def isPalindrome(str):
     
        # Run loop from 0 to len/2 
        for i in range(0, int(len(str)/2)): 
            if str[i] != str[len(str)-i-1]:
                return False
        return True
 
if(False):
    
    def isPalindrome(s):
         
        # Using predefined function to 
        # reverse to string print(s)
        rev = ''.join(reversed(s))
     
        # Checking if both string are 
        # equal or not
        if (s == rev):
            return True
        return False
 
