# GoTreeScape
Declarative grammar has becoming an increasingly significant technique for understanding visualization design space. We propose GoTreeScape system to facilitate the navigation and exploration of the vast design space implied by GoTree, a declarative grammar of tree visualizations. To provide users with the design space overview, GoTreeScape utilizes an Encoder-Decoder architecture to project tree visualizations into a 2D landscape, taking into account the  relationships between different design features. Furthermore, GoTreeScape includes an exploratory framework, enabling top-down, bottom-up, and hybrid modes to support the inherently undirected nature of exploratory search. We demonstrate that GoTreeScape can expand the diversity of user-designed tree visualizations through two case studies. 

This repository consists of the code for two main parts of the system: 1) the GoTreeScape prototype system. 2) The Grammar-based Variational Auto-Encoder machine learning model. 




# GoTreeScape prototype system

## GoTreeScape backend
```
cd ./BackEnd
```

### run the server
```
python main.py
```

## GoTreeScape fontend
### change to the frontend folder
```
cd ./FrontEnd
```

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
