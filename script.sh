npm install -g wml
wml add ./sdk ./app/node_modules/sdk-gubuy-test
cp ../Downloads/env.js app
cd sdk
npm install
cd ../app
npm install
cd ios
pod install 
cd ../..
wml start