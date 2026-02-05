import appConfig from './app';

export const metaData = {
    title: appConfig.title,
    description: appConfig.description,
    baseUrl: appConfig.url,
    siteUrl: appConfig.url,
    author: appConfig.name,
    email: appConfig.social.email,
    twitter: '@' + appConfig.social.github,
};
