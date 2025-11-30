package com.example.investmenttracker.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Utility class for retrieving internationalized messages.
 * Provides convenient methods to get messages from the message bundle.
 */
@Component
public class MessageUtil {

    private final MessageSource messageSource;

    @Autowired
    public MessageUtil(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * Get a message by key without parameters
     * 
     * @param key the message key
     * @return the localized message
     */
    public String getMessage(String key) {
        return getMessage(key, null);
    }

    /**
     * Get a message by key with parameters
     * 
     * @param key    the message key
     * @param params the parameters to substitute in the message
     * @return the localized message with parameters substituted
     */
    public String getMessage(String key, Object... params) {
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage(key, params, locale);
    }

    /**
     * Get a message with a default value if key is not found
     * 
     * @param key            the message key
     * @param defaultMessage the default message if key is not found
     * @param params         the parameters to substitute in the message
     * @return the localized message or default message
     */
    public String getMessageOrDefault(String key, String defaultMessage, Object... params) {
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage(key, params, defaultMessage, locale);
    }
}
