package com.app;

import com.facebook.react.modules.network.OkHttpClientFactory;
import com.facebook.react.modules.network.ReactCookieJarContainer;
import okhttp3.CertificatePinner;
import okhttp3.OkHttpClient;
import okhttp3.CertificatePinner.Builder;

public class CertificatePinningClientFactory implements OkHttpClientFactory {

    @Override
    public OkHttpClient createNewNetworkModuleClient(){
  
    String hostName = "mi-testing.iduruguay.gub.uy";
    String certificatePublicKey = "sha256/e2fj6u6UXRKWZx16vLeD8yShQg0z8CllD4J7bhp0Nzg=";

    OkHttpClient.Builder clientBuilder = new OkHttpClient.Builder();
    CertificatePinner certificatePinner = new CertificatePinner.Builder()
      .add(hostName, certificatePublicKey)
      .build();
    clientBuilder.certificatePinner(certificatePinner);
    clientBuilder.cookieJar(new ReactCookieJarContainer());
    
    return clientBuilder.build();
  }
}