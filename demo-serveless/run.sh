# instalar 
npm i -g serveless  

# 1 inicializar o serveless
sls

# 2 sempre fazer deploy do ambiente antes de tudo
#para verificar se esta com ambiente funcionando

sls deploy

# 2 configura o serveless.yml
service: hello-sls
frameworkVersion: "3"

provider:
  name: aws
  runtime: nodejs18.x

functions:
  function1:
    handler: index.handler
    events:
      - http:
          path: hello
          method: get
#3 invoka o serveless com serveless invoke
sls invoke -f function1

#4 invokar o serveless localmente 
sls invoke local -f function1 --l

#5 configurar o dashbord do serverless
#agora ele vai indentificar que ja e um arquivo serveless
sls