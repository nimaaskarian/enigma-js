for file in *.png
do 
convert $file -crop +40+40 -crop -33-10 $file
done
