import { Observer, Subject } from './Interfaces';

// Clase para el Usuario (Observador)
class User implements Observer {
    constructor(public username: string) {}
  
    update(message: string): void {
      console.log(`Notificación para ${this.username}: ${message}`);
      // Aquí puedes agregar el mensaje al buzón de notificaciones del usuario
    }
  }

  // Clase para el Servicio de Notificaciones (Sujeto)
class NotificationService implements Subject {
    notifyObservers(message: string): void {
        throw new Error('Method not implemented.');
    }
    private observers: Observer[] = [];
  
    addObserver(observer: Observer): void {
      this.observers.push(observer);
    }
  
    removeObserver(observer: Observer): void {
      const observerIndex = this.observers.indexOf(observer);
      if (observerIndex > -1) {
        this.observers.splice(observerIndex, 1);
      }
    }
  
    notifyUser(user: string, message: string): void {
      /*for (const observer of this.observers) {
        if (observer.user === user) {
          observer.update(message);
        }
      }*/
    }
  }

  /**
   * const notificationService = new NotificationService();
const user = new User('username');

notificationService.addObserver(user);

/------------------------------------------------------------------------------/
class Compra implements Subject {
  // ...otros métodos y propiedades...

  aceptar(): void {
    this.estado = 'aceptada';
    this.notifyObservers(`La compra ${this.id} ha sido aceptada`);
  }

  rechazar(): void {
    this.estado = 'rechazada';
    this.notifyObservers(`La compra ${this.id} ha sido rechazada`);
  }
}

class Usuario implements Observer {
  // ...otros métodos y propiedades...

  update(message: string): void {
    console.log(`Usuario ${this.username} recibió una notificación: ${message}`);
    // Aquí puedes manejar la notificación, por ejemplo, guardándola en la base de datos
    // o enviándola al frontend a través de un websocket
  }
}
   */
