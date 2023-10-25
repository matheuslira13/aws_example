#1° criar arquivo de politcas de segurança 

#1/5 criar uma pasta logs

#2° criar role de segurança na AWS

aws iam create-role \

    --role-name lambda-exemplo \
    --assume-role-policy-document file://politicas.json \
    | tee   logs/role.log

#3°Criar arquivo com conteudo e zipa-lo 

zip function.zip index.js

aws lambda create-function \
    --function-name hello-cli \
    --zip-file fileb://function.zip \
    --handler index.handler \
    --runtime nodejs18.x \
    --role arn:aws:iam::025001505033:role/lambda-exemplo3
    | tee logs/lambda-create.log

#4° invoke lambda
aws lambda invoke \
    --function-name hello-cli \
    --log-type Tail \
    logs/lambda-exec.log

#5° fazer um update na lambda , tem que atualizar o index e zipalo novamente
zip function.zip index.js

aws lambda update-function-code \
    --zip-file fileb://function.zip \
    --function-name hello-cli \
    --publish \
    | tee logs/lambda-update.log
# para ver o resultado do update vc tem invoca novamente 
aws lambda invoke \
    --function-name hello-cli \
    --log-type Tail \
    logs/lambda-update.log

#6° remover 
aws lambda delete-function \
    --function-name hello-cli \

aws iam delete-role \
    --role-name lambda-exemplo3