import AWS from 'aws-sdk';
import LocalizationService from '../libraries/localization_service'
import Constants from '../../miscellaneous/constants'

class S3Uploader {
  static upload(file, folder_name) {
    AWS.config.update({
      region: process.env.REACT_APP_AWS_S3_REGION,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: process.env.REACT_APP_AWS_COGNITO_POOL_ID
      })
    });

    let s3 = new AWS.S3({
      params: {
        Bucket: process.env.REACT_APP_AWS_S3_BUCKET_NAME
      }
    });

    if (!folder_name || folder_name.length < 1) {
      return Promise.reject(new Error(LocalizationService.formatMessage('aws.s3.invalid_bucket_folder_name')));
    }
    else {
      return s3.upload({
        Key: `${folder_name || ''}/${file.name}-${Date.now()}`,
        Body: file,
        ContentType: file.type,
        ACL: "public-read"
      }).promise();
    }
  }
}

export default S3Uploader;
