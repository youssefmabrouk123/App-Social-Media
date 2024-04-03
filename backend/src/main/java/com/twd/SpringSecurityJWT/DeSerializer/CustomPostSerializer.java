package com.twd.SpringSecurityJWT.DeSerializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.twd.SpringSecurityJWT.entity.Post;

import java.io.IOException;

// Custom serializer example
public class CustomPostSerializer extends StdSerializer<Post> {
    public CustomPostSerializer() {
        this(null);
    }

    public CustomPostSerializer(Class<Post> t) {
        super(t);
    }

    @Override
    public void serialize(Post post, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        // Custom serialization logic
    }
}
