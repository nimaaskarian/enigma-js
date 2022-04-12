for file in *.png
do 
convert $file -resize 32x32\> \
          -size 32x32 xc:transparent +swap -gravity center  -composite \
          $file
done
