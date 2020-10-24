### parte 1

#Nuevo proyecto (tarea):

##Proyecto: 
Agencia de alquiler de autos

##Tecnologías:
HTML, CSS, JS, Nunjucks, Bulma, Node.JS, SQLite.

Nunjucks y bulma no lo vimos en detalle, pero son parecidos a handlebars y bootstrap
Este ejercicio ayuda a que hagan su propia investigación tecnologías y se acostumbren a leer documentación.

##Requerimientos:
ABM/CRUD de autos
Marca
Modelo
Año
Kms
Color
Aire acondicionado (si/no)
Pasajeros
Manual/Automático

### parte 2

El sistema de alquiler de autos (hasta ahora sólo un CRUD/ABM) tiene nuevos requerimientos.
Se deben poder dar de alta clientes manualmente (en el sistema de backoffice/panel de administración) -- el sistema de alquiler aún no tiene un sitio web visible al público, es sólo para empleados internos.

Nombres
Apellidos
Tipo Documento
Nro Documento
Nacionalidad
Dirección
Teléfono
e-mail
fecha de nacimiento

Se deben poder gestionar alquileres manualmente
1 alquiler se realiza entre 1 auto (máximo) y 1 cliente (máximo).
La tabla de alquileres debe guardar:
auto
cliente
el precio unitario del auto (precio de alquiler por día) 
Por más que se esté duplicando información, es importante por motivos de auditoría, porque el precio del auto puede cambiar en el futuro pero la transacción (el alquiler) se realizó en el momento adecuado
fecha desde
fecha hasta
precio total
medio de pago (efectivo ó tarjeta)
si el alquiler está pago (booleano)
Realizar diagrama C4 L1, L2 y L3 del sistema de gestión de autos.
