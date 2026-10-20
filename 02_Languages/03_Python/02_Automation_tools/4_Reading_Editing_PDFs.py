import PyPDF2
import os

filedir = str(os.getcwd()) + "\\00_PDFs"
os.chdir(filedir)
print(os.getcwd())

loadmm1 = open('mm1.pdf', 'rb')
loadmm2 = open('mm2.pdf', 'rb')
pdf1 = PyPDF2.PdfReader(loadmm1)
pdf2 = PyPDF2.PdfReader(loadmm2)
print(len(pdf1.pages))
page = pdf1.pages[0]
# print(page.extract_text())

'''
page = ""
for pagenum in range(len(pdf1.pages)):
    page += pdf1.pages[pagenum].extract_text()

print(page)
'''

writer = PyPDF2.PdfWriter()
for pagenum in range(len(pdf1.pages)):
    if pagenum % 2 != 0:
        page = pdf1.pages[pagenum]
        writer.add_page(page)

for pagenum in range(len(pdf2.pages)):
    if pagenum % 2 == 0:
        page = pdf2.pages[pagenum]
        writer.add_page(page)

newpdf = open('combinedmm.pdf', 'wb')
writer.write(newpdf)
print(os.getcwd())
loadmm1.close()
loadmm2.close()
newpdf.close()
