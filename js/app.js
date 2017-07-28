var Vue = Vue || require('vue');

var chatComponent = Vue.extend({
  template: `<div class="panel panel-primary">
                  <div class="panel-heading">
                    <h3 class="panel-title">CHAT</h3>
                  </div>
                  <div class="panel-body painel-body">
                    <ul class="chat list-unstyled">
                      <li class="clearfix" v-bind:class="{left: !isUser(o.email), right: isUser(o.email)}"  v-for="o in chat.messages">
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
                      <input  type="text" class="form-control left" placeholder="Digite sua mensagem" name="" value="">
                      <span class="input-group-btn">
                        <button type="submit" class="btn btn-success btn-md">ENVIAR</button>
                      </span>
                    </div>
                  </div>
                </div>`,
    data: function(){
      return {
          user: {
            email: "robertomelo822@gmail.com",
            name: "Roberto Soaeres"
          },
          chat: {
            messages: [
              {
                email: "fulano@gmail.com",
                text: "Olá, eu sou Roberto, tudo OK?",
                name: "Roberto",
                photo: "http://placehold.it/50/00FFF/fff&text=RR"
              },
              {
                email: "robertomelo822@gmail.com",
                text: "Tudo OK, e você?",
                name: "Soares",
                photo: "http://placehold.it/50/DDDDDD/fff&text=EU"
              }
              ,
              {
                email: "robertomelo822@gmail.com",
                text: "De onde você é?",
                name: "Soares",
                photo: "http://placehold.it/50/DDDDDD/fff&text=EU"
              }
            ]
          }
        };
      },
      methods: {
        isUser: function(email){
          return this.user.email == email;
        }
      }

});

var appComponent = Vue.extend({});

//var chat = new Vue( { el:"#chat" });

//criar uma instancia do vue-router
var router = new VueRouter();

//apontamento das rodas
console.log(Vue);
router.map({
  '/chat': {
           component: chatComponent
       }
});

//iniciar a execucao da rota
router.start(appComponent, "#app");
