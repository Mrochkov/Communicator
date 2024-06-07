from channels.generic.websocket import WebsocketConsumer


class MyConsumer(WebsocketConsumer):
    def connect(self):
        # Called on connection.
        # To accept the connection call:
        self.accept()
        # To reject the connection, call:
        # self.close()

    def receive(self, text_data=None, bytes_data=None):
        self.send(text_data=text_data)

    def disconnect(self, close_code):
        pass
        #self.channel_layer.group_discard("my_group", self.channel_name)