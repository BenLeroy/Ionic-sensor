# Ionic-Sensor


## Ionic built simplesensor

Transform simplesensor with [ionic.io](http://ionicframework.com/) framework


## Requirements :

To set up ionic's environment correctly : [loopback-users-mobile](https://github.com/BenLeroy/loopback-users-mobile).

You just need to run `$ npm install -g ionic` to add ionic framework.


###  How to install :

Once requirements are met, clone this repo by running :

`$ git clone https://github.com/BenLeroy/Ionic-sensor.git`

Or download the project's [Zip](https://github.com/BenLeroy/Ionic-sensor/archive/master.zip)

Then run :

```bash
$ npm install
$ bower install
```

## How to use :

To make the application point to the right server address, you'll need to change [app.js](https://github.com/BenLeroy/Ionic-sensor/blob/master/www/js/app.js) :

	- at line 24 (LoopBackResourceProvider.setUrlBase ('[yourServerAdress]/api'))
	- and line 109 (socket.io connector).


### Emulation

Use your favorite emulator to run the project.

To build the project with ionic use `$ ionic build [platform]` from project's root.

For Android, use `$ ionic build android` ; the built APK will be found in [dir]/platforms/[android]/build/outputs/apk/android-debug.apk.

If you want to have a working preview, use `$ ionic serve`, it should open your default browser and display a working app, else navigat to [http://localhost:8100](http://localhost:8100).

