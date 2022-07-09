const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { OAuthStrategy, expressOauth } = require('@feathersjs/authentication-oauth');
const axios = require('axios');

class GoogleStrategy extends OAuthStrategy {
  // async getProfile(authResult) {
  //   const accessToken = authResult.accessToken;

  //   const { data } = await axios
  //     .get(
  //       `https://openidconnect.googleapis.com/v1/userinfo?access_token=${accessToken}`
  //     )
  //     .then((res) => {
  //       return res;
  //     })
  //     .catch((error) => console.log("autherr", error));

  //   return data;
  // }

  async getEntityData(profile) {

    // this will set 'googleId'
    const baseData = await super.getEntityData(profile);

    // console.log("profile", profile);

    // this will grab the picture and email address of the Google profile
    return {
      // ...baseData,
      g_uid: baseData.googleId,
      email: profile.email
      // profilePicture: profile.picture,
      // email: profile.email
    };
  }

  // async getEntityData(profile) {
  //   // this will set 'googleId'
  //   const baseData = await super.getEntityData(profile);
  //   const existingOauthEntity = await super.findEntity(profile)

  //   // Check if user already exist
  //   if(existingOauthEntity){
  //     return {
  //       ...baseData
  //     }
  //   }else{
  //     return {
  //       ...baseData,
  //       email: profile.email,
  //     };
  //   }
  // }
}


module.exports = app => {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());
  authentication.register('google', new GoogleStrategy());

  app.use('/authentication', authentication);
  app.configure(expressOauth());
};
