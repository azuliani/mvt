echo "Pushing $1"
for i in `seq $1`; do
curl localhost:3000/push
done
