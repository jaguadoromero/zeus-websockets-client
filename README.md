# Vue Zeus Websocket client
Plugin para Vue para usar websockets con [Zeus Websockets Server](https://github.com/jaguadoromero/zeus-websockets-client)

## Instalación
Mediante npm:
```
npm install --save vue-zeus-websockets
```

## Importación  
Está preparado para usar con **Webpack**.

En el archivo principal de Vue:

```js
import ZeusWebsockets from 'vue-zeus-websockets';

Vue.use(new ZeusWebsockets({
    connection: 'ws://project.test:6001',
}));
```

> Si el servidor corre sobre SSL, en `connection`, el protocolo a usar sería `wss://`

> Desde cualquier componente de Vue se puede acceder al objeto `this.$socket` desde donde se realizarán las acciones.

## Emitir mensaje 
> **this.$socket.emit(*(*EventName*, *data*, **[*channel*]**)

*EventName*: Nombre del evento  

*data*: Datos a enviar. Normalmente un objeto Javascript.  

*channel*: (Opcional) Nombre de canal (o canales) a los cuales se enviarán los datos. Si no se especifica se enviarán a todos los clientes conectados. Puede ser un string o un array si se quiere especificar varios canales.

Ejemplo:
```js
this.$socket.emit('SendParams', {a: 1, b: 2}, 'channel1');
```

## Unirse a un canal
Para recibir datos que van destinados a un cierto canal, primero hay que unirse.
Se debe hacer una vez se ha realizado la conexión al servidor de websockets.

Ejemplo para unirse a ***canal1***:
```js
mounted() {
    this.$socket.onConnect(() => {
        this.$socket.join('canal1');
        
        ...
    });
}
```

También puedes unirte a varios canales pasando el listado como *array*:

```js
this.$socket.join(['canal1', 'canal2']);
```

## Escuchar mensaje
> **this.$socket.listen**(*EventName*, *callback*)

Por ejemplo, cuando se recibe el evento ***SendParams***, se ejecuta un `console.log` con los datos recibidos:
```js
mounted() {
    this.$socket.onConnect(() => {
        ...
        
        this.$socket.listen('SendParams', (data) => {
            console.log(data);
        });
    });
}
```

> Hay que tener en cuenta que cuando se envian datos, los reciben todos los clientes **menos el que realizó el envio**. Se ha realizado así a propósito para que el propio componente que ha realizado el envio no reaccione al ***listen*** y se ejecuten procesos innecesarios (por ejemplo una recarga de datos).