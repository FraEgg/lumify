package io.lumify.core.model.artifactThumbnails;

import com.altamiracorp.bigtable.model.ModelSession;
import com.altamiracorp.bigtable.model.Row;
import com.beust.jcommander.internal.Nullable;
import com.google.inject.Inject;
import io.lumify.core.user.User;

import java.io.IOException;
import java.io.InputStream;

public class NoOpArtifactThumbnailRepository extends ArtifactThumbnailRepository {
    @Inject
    public NoOpArtifactThumbnailRepository(@Nullable ModelSession modelSession) {
        super(modelSession);
    }

    @Override
    public BigTableArtifactThumbnail fromRow(Row row) {
        throw new RuntimeException("not supported");
    }

    @Override
    public Row toRow(BigTableArtifactThumbnail artifactThumbnail) {
        throw new RuntimeException("not supported");
    }

    @Override
    public String getTableName() {
        throw new RuntimeException("not supported");
    }

    @Override
    public ArtifactThumbnail getThumbnail(Object artifactVertexId, String thumbnailType, int width, int height, User user) {
        return null;
    }

    @Override
    public byte[] getThumbnailData(Object artifactVertexId, String thumbnailType, int width, int height, User user) {
        return new byte[0];
    }

    @Override
    public ArtifactThumbnail createThumbnail(Object artifactVertexId, String thumbnailType, InputStream in, int[] boundaryDims, User user) throws IOException {
        return super.generateThumbnail(in, boundaryDims);
    }
}
