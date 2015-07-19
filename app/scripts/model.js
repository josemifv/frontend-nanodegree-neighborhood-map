var initialPlaces = [{
    type: 'hotel',
    category: '4',
    name: 'Ágora Hotel',
    address: 'Parras, 25',
    phone: '(+34) 927 626 360',
    website: 'www.ahhotels.com',
    email: 'Not provided',
    description: 'Hotel centro ciudad, restaurante terraza con vistas panorámicas.'
}, {
    type: 'hotel',
    category: '1',
    name: 'AHC Hoteles',
    address: 'Avenida de la Universidad 51',
    phone: '(+34) 927 628 223',
    website: 'www.ahchoteles.com',
    email: 'reservas@ahchoteles.com',
    description: 'Situado en la confluencia de la Avenida de la Universidad en la carretera de Trujillo a valencia de alcántara, Madrid, a su paso por la capital cacereña, junto al campus universitario y a tan sólo cinco minutos del centro de la ciudad y a menos de la zona monumental (en coche), el AHC cuenta con 115 habitaciones dobles.'
}, {
    type: 'hotel',
    cagegory: '2',
    name: 'Alameda Palacete',
    address: 'General Margallo 45',
    phone: '(+34) 927 211 674',
    website: 'www.alamedapalacete.com',
    email: 'reservas@alamedapalacete.com',
    description: 'Palacete restaurado, en a 200 m, de la Plaza Mayor. Consta de de 9 habitaciones, las cuales se dividen en doble, suit y familiar. Está totalmente equipado con ropa de cama, toallas, secador, calefacción, aire acondicionado, baño completo, red wifi gratuita. En el interior del Palacete hay un patio para uso y disfrute de los clientes. Damos servicio de desayuno, en el patio o en la habitación como desee el cliente. Tenemos 3 plazas de aparcamiento en la misma puerta del establecimiento. Tiene un encanto muy especial.'
}, {
    type: 'youth hostel',
    name: 'Albergue Las Veletas',
    address: 'General Margallo, 3',
    phone: '(+34) 927 211 210',
    web: 'www.alberguelasveletas.com',
    email: 'info@alberguelasveletas.com',
    description: 'Alojamiento con 40 camas, 9 baños, céntrico y a 5 minutos aprox. de la plaza mayor.'
}, {
    type: 'AT',
    category: '2',
    name: 'Alojamiento Encanto',
    address: 'Muñoz Chaves 3',
    phone: '(+34) 600 849 844',
    website: 'www.alojamientoencanto.com',
    email: 'info@alojamientoencanto.com',
    description: 'Los apartamentos Encanto se encuentran en el casco antiguo de Cáceres, a sólo 50m de la plaza mayor y a poco metros de los mejores restaurantes, bares y tiendas de la ciudad. Este alojamiento, perfectamente equipado, se encuentra en un edificio restaurado del s. XVI/XVII y ofrece una combinación de estilo rústico y moderno en dos apartamentos (La Bóveda y Los Arcos), con techos abovedados, fuertes muros de piedra, arcos, chimenea, etc. Ideal para una estancia agradable en el corazón de Cáceres.'
}, {
    type: 'hotel',
    name: 'Apartamento H2 Cáceres',
    address: 'Maestro Sánchez Garrido, 3',
    phone: '(+34) 927 213 229',
    website: 'www.hoteles2.com/apartamentos-h2-caceres.html',
    email: 'caceres@hoteles2.com',
    description: 'Conoce la ciudad monumental de Cáceres, alojándote en pleno centro en cómodos y equipados Apartamentos Turísticos. Cáceres, desconocida por muchos, amada por otros tantos, no defrauda al visitante. Si no has venido nunca quedarás sorprendido por su Ciudad Monumental, declarada Patrimonio de la Humanidad por la UNESCO, y su excelente gastronomía y por el trato de los cacereños, siempre amables y excelentes anfitriones. Si ya has venido seguro que te quedan rincones por conocer y nuevos platos que degustar. Los ibéricos y la huerta, además de nuestros guisos son la excusa perfecta para recordar Cáceres con un excelente sabor.'
}, {
    type: 'AT',
    category: '-',
    name: 'Apartamentos Cáceres',
    address: 'Plaza de la Concepción 19',
    phone: '(+34) 645 895 361',
    website: 'www.apartamentoscaceres.net',
    email: 'apartamentoscc@gmail.com',
    description: 'Apartamentos Cácereses un grupo de Apartamentos Turísticos autorizados situados en pleno centro histórico de Cáceres, Producto de la rehabilitación de varios alojamientos en dos edificios que conservan la estructura tradicional de la ciudad histórica. Poseen cocinas completamente equipadas, salones y dormitorios. Con tamaños a partir de 55 metros y capacidad de 1 a 6 persona son el lugar deal para familias con niños, grupo de amigos, parejas y viajeros solitarios que buscan una alternativa diferente a los alojamientos tradicionales a precios muy interesantes.'
}, {
    type: 'AT',
    category: '-',
    name: 'Apartamentos Montesol',
    address: 'Los Riveros 20',
    phone: '(+34) 699 791 365',
    website: 'www.apartamentoturisticomontesol.com',
    email: 'info@apartamentoturisticomontesol.com',
    description: 'Apartamento Turístico Montesol, ideal para familiares y/o grupos de amigos que visiten la ciudad de Cáceres Patrimonio de la Humanidad, capacidad de alojamiento hasta 10 personas. A pie 5 minutos del establecimiento hipermercados de alimentación, parada de taxis, transporte público, bares y restaurantes A pie 25 minutos de la Plaza Mayor de Cáceres, coche o transporte público 5 minutos del centro.'
}, {
    type: 'AT',
    category: '-',
    name: 'AT Casa Pintada',
    address: 'Plaza de Canterías 7',
    phone: '(+34) 695 690 556',
    website: 'www.casapintada.com',
    email: 'casapintada@casapintada.com',
    description: 'Una alternativa de alojamiento al hotel convencional. Distintas casas completamente equipadas, todas ellas situadas en el centro de Cáceres Con diferentes capacidades (de 2 a 8 personas.) Dormitorios individuales o dobles, amplios salones, baños con jacuzzi y cocinas completamente equipadas. Las Casas Pintadas combinan para sus huéspedes la singularidad de las casas rurales, la comodidad del hotel de lujo y la belleza del alojamiento con encanto.'
}, {
    type: 'AT',
    category: '-',
    name: 'AT Cazires',
    address: 'Camberos, 7',
    phone: '(+34) 658 989 165',
    website: 'www.apartamentoturisticocazires.com',
    email: 'apartamentoscazires@gmail.com',
    description: 'Apartamentos situados en la Zona Monumental de Cáceres junto al Palacio de Godoy y la Iglesia de Santiago, dotados de todo lo necesario para pasar una agradable estancia.'
}, {
    type: 'AT',
    category: '-',
    name: 'AT Puerta de Mérida',
    address: 'Plaza de Santa Clara 1',
    phone: '(+34) 619 916 197',
    website: 'www.apartamentocaceres.es',
    email: 'elenagil@gmail.com',
    description: 'El apartamento Puerta de Mérida es una vivienda medieval rehabilitada en el año 2011 y situada en la Plaza de Santa Clara de Cáceres, dentro de la zona monumental declarada Patrimonio de la Humanidad por la Unesco. La vivienda se desarrolla en 3 plantas tipo loft, con espacios abiertos y decoración interior de estilo moderno. En la segunda planta está el dormitorio principal con cama de matrimonio (160 x 200 cm) colchón y almohadas de viscoelástico. Aire acondicionado, calefacción, armario empotrado, mesillas y cómoda de gran capacidad y 3 ventanas tipo velux con oscurecedores. La primera planta cuenta con salón comedor con tv de pantalla plana con TDT. La cocina está integrada y totalmente equipada. Además hay una despensa y un cuarto de baño con ducha con columna de hidromasaje y mampara de vidrio.En planta baja se encuentra uno de los dormitorios con techo tradicional: dos bóvedas de crucería y una de cañón. Contiene dos camas individuales, armario y estudio con mesas de trabajo. Hay Wifi gratis en todo el establecimiento.'
}, {
    type: 'AT',
    category: '-',
    name: 'AT Salor',
    address: 'Moret, 20',
    phone: '(+34) 927 246 400',
    website: 'www.hotelalfonsoix.com',
    email: 'Not provided',
    description: 'Junto al hotel y al Parking del Hotel Alfonso IX, podrá disfrutar de nuestros Apartamentos Turísticos, que ofrecen otra opción de alojamiento igualmente bien situada y con todas las comodidades para su estancia.'
}, {
    type: 'camping',
    category: '-',
    name: 'Camping de Cáceres',
    address: 'Ctra. Nacional 630, km 549,5',
    phone: '(+34) 927 233 100',
    website: 'www.campingcaceres.com',
    email: 'reservas@campingcaceres.com',
    description: 'El Camping Cáceres dispone de 129 parcelas dotadas de baño individual (ducha, inodoro y lavabo), agua caliente y electricidad, 10 Bungalows completamente equipados de 2 a 8 plazas, 8 habitaciones dobles, cafetería y Restaurante con terrazas, recepción y biblioteca, Salón social, Lavandería, Tienda, Red Wi-fi gratuita, Dos piscinas con zonas verdes y zona infanti, Animación infantil (bajo petición) y Aparcamiento gratuito'
}, {
    type: 'hotel',
    category: '0',
    name: 'Hostal Alqazeres',
    address: 'Camino Llano 34',
    phone: '(+34) 927 227 000',
    website: 'www.alqazeres.com',
    email: 'información@alqazeres.com',
    description: 'Situado en el corazón de la ciudad de Cáceres, a tan sólo 5 minutos de la Plaza Mayor o su Parte Antigua. Desde aquí tendrá acceso tanto a la zona histórica como a centros de ocio, pubs, tiendas o los mejores restaurantes de la ciudad. Además la situación geográfica de Cáceres le permitirá desplazarse a cualquier lugar de interés turístico de Extremadura en apenas una hora.'
}, {
    type: 'hotel',
    category: '0',
    name: 'Hostal Plaza de Italia',
    address: 'Constancia, 12',
    phone: '(+34) 927 627 294 - (+34) 628 119 968',
    website: 'www.hostalplazadeitalia.es',
    email: 'contacto@hostalplazadeitalia.es',
    description: 'Situado en el corazón de la ciudad de Cáceres, a tan sólo 5 minutos de la Plaza Mayor o su Parte Antigua. Desde aquí tendrá acceso tanto a la zona histórica como a centros de ocio, pubs, tiendas o los mejores restaurantes de la ciudad. Además la situación geográfica de Cáceres le permitirá desplazarse a cualquier lugar de interés turístico de Extremadura en apenas una hora.'
}];

var Place = function(data) {
    this.type = data.type;
    this.category = data.category;
    this.name = data.name;
    this.address = data.address;
    this.phone = data.phone;
    this.website = data.website;
    this.email = data.email;
    this.coordinates = data.coordinates;
};

var appViewModel = function() {
    var self = this;

    self.placesList = ko.observableArray([]);
    self.searchText = ko.observable('');
    self.showRestaurants = ko.observable(true);
    self.showHotels = ko.observable(true);
    self.showOthers = ko.observable(true);

    initialPlaces.forEach(function(placesListItem) {
        self.placesList.push(new Place(placesListItem));
    });

    self.placeTypeFilter = ko.computed(function() {
        var filter = [];
        if (self.showHotels()) {
            filter.push("hotel");
        }
        if (self.showRestaurants()) {
            filter.push("restaurant");
        }
        if (self.showOthers()) {
            filter.push("other");
        }
        return filter;
    });

    self.filteredPlacesList = ko.computed(function() {
        var textFilter = self.searchText().toLowerCase();
        var placeTypeFilter = self.placeTypeFilter();

        if (!textFilter && placeTypeFilter.length === 3) {
            return self.placesList();
        }

        // Filter results
        return ko.utils.arrayFilter(self.placesList(), function(placesListItem) {
            return placesListItem.name.toLowerCase().indexOf(textFilter) >= 0 && placeTypeFilter.indexOf(placesListItem.type) > -1;
        });
    });

    self.updateMarkers = ko.computed(function() {
        addMarkers(self.filteredPlacesList);
    });
};

ko.applyBindings(new appViewModel());
