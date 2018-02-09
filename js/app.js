// Initialize Firebase
var config = {
 
};
var firebaseApp = firebase.initializeApp(config);
var db = firebaseApp.database();

var chatComponent = Vue.extend({
  template: `<div class="panel panel-primary">
                  <div class="panel-heading">
                    <h3 class="panel-title">CHAT </h3>
                  </div>
                  <div class="panel-body painel-body" id="chat-scroll">
                    <ul class="chat list-unstyled">
                      <li class="clearfix" v-bind:class="{left: !isUser(o.email), right: isUser(o.email)}"  v-for="o in messages">
                          <div v-bind:class="{'pull-left':  !isUser(o.email), 'pull-right': isUser(o.email)}">
                            <img v-bind:src="o.photo" class="img-circle" alt="">
                          </div>
                          <div class="chat-body">
                            <strong v-bind:class="{'': !isUser(o.email), 'name-position': isUser(o.email)}">{{o.name}}</strong>
                            <p v-bind:class="{'': !isUser(o.email), 'mensagem-position': isUser(o.email)}">
                                {{o.text}}
                            </p>
                          </div>
                      </li>
                    </ul>
                  </div>
                  <div class="panel-footer">
                    <div class="input-group form-group col-md-12">
                      <input  type="text" class="form-control left"
                          placeholder="Digite sua mensagem" v-model="message" name="message" value=""
                          data-toggle="tooltip" data-placement="top" title="Digite uma mensagem!"
                          @keyup.enter="sendMessage" require>
                      <span class="input-group-btn">
                        <button type="submit" class="btn btn-success btn-md" @click="sendMessage">ENVIAR</button>
                      </span>
                    </div>
                  </div>
                </div>`,
    created: function(){
      var roomRef = 'chat/rooms/'+this.$route.params.room;
      this.$bindAsArray('messages', db.ref(roomRef + '/messages'));

    },
    data: function(){
      return {
          user: {
            email: localStorage.getItem('email'),
            name: localStorage.getItem('name'),
            photo:localStorage.getItem('photo')
          },
          message: ''

        };
      },
      methods: {
        isUser: function(email){
          return this.user.email == email;
        },
        sendMessage: function(){
            var conteudo = $('input[name="message"]').val();
      			//console.log(conteudo);
      			if(conteudo.length > 1){
      				$('[data-toggle="tooltip"]').tooltip('hide');
      				this.$firebaseRefs.messages.push({
      					name: this.user.name,
      					email: this.user.email,
      					text: this.message,
      					photo: this.user.photo
      				  });
      				  $('input[name="message"]').val("")
      				  rolagemAuto();

      			} else {
      				$('[data-toggle="tooltip"]').tooltip('show');
      			}
        }
      }

});



var roomsComponent = Vue.extend({
  template: `
            <div class="col-md-4" v-for="o in rooms">
              <div class="panel panel-primary">
                <div class="panel-heading">{{o.name}}</div>
                <div class="panel-body">
                  {{o.description}}
                  <br>
                  <a href="javascript:void(0)" @click="openModal(o)">ENTRAR</a>
                </div>
              </div>
            </div>
            <div class="modal fade" id="modalLoginEmail" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="">Entre com as informações</h4>
                  </div>
                  <div class="modal-body">
                    <form class="">
                      <div class="form-group">
                        <label for="">Email</label>
                        <input type="email" class="form-control" name="email" id="email" v-model="email" placeholder="" require>
                      </div>
                      <div class="form-group">
                        <label for="">Nome</label>
                        <input type="text" class="form-control" name="name" id="name" v-model="name" placeholder="" require>
                      </div>
                    </form>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-primary" @click="login">LOGIN</button>
                  </div>
                </div>
              </div>
            </div>`,
            firebase: {
              rooms: db.ref('chat/rooms')
            },
            data: function(){
              return {
                rooms: [
                  {id: "001", name: "PHP", description: "Aprendendo PHP"},
                  {id: "002", name: "Java", description: "Padrões de Desenvolvimento"},
                  {id: "003", name: "C#", description: "Desenvolvimento orientado a performance"}
                ],
                name: '',
                email: '',
                room: null
              }

            },
            methods:{
              login: function(room){
                //gavando na session localStorage do Navegador
                localStorage.setItem('name', this.name);
                localStorage.setItem('email', this.email);
                localStorage.setItem('photo', 'http://www.gravatar.com/avatar/'+md5(this.email)+'.jpg');
                $('#modalLoginEmail').modal('hide');
                this.$route.router.go('/chat/'+this.room.id);
              },
              openModal: function(room){
                this.room = room;
                $('#modalLoginEmail').modal('show');
              }
            }
});

var rooms = [
  {id: "001", name: "PHP", description: "Aprendendo PHP"},
  {id: "002", name: "Java", description: "Padrões de Desenvolvimento"},
  {id: "003", name: "C#", description: "Desenvolvimento orientado a performance"},
  {id: "004", name: "Javascript", description: "Dominando a internet"}
];
//novo componente
var roomsCreateComponent = Vue.extend({
            template: `<ul>
                        <li v-for="o in rooms">{{o.name}}</li>
                      </ul>`,
            firebase: {
              rooms: db.ref('chat/rooms')
            },
            ready: function(){
              var chatRef = db.ref('chat');
              var roomsChildren = chatRef.child('rooms');
              //para cada sala que existir atualizar os dados
              rooms.forEach(function(room){
                roomsChildren.child(room.id).set({
                  name: room.name,
                  description: room.description
                })
              });
            }
});

var appComponent = Vue.extend({});

//criar uma instancia do vue-router
var router = new VueRouter();

//apontamento das rodas
console.log(Vue);
router.map({
    '/chat/:room': {
       component: chatComponent
     },
     '/rooms': {
       component: roomsComponent
     },
     '/rooms-create': {
       component: roomsCreateComponent
     }
});

//iniciar a execucao da rota
router.start(appComponent, "#app");


/*
	COMANDO PARA TERMINAL PARA LIMPAR TODAS MENSAGENS DA SALA PELO SEU ID
	curl -X DELETE 'https://vue-js-firebase-20c0a.firebaseio.com/chat/rooms/001/messages.json'
*/
