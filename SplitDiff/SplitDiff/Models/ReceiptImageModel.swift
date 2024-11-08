//
//  ReceiptImageModel.swift
//  SplitDiff
//
// Abstract:
//  An observable state object that contains receipt image details.
//
//  Created by Phuykong on 11/6/24.
//

import SwiftUI
import PhotosUI
import CoreTransferable
import AIReceiptScanner

@MainActor
class ReceiptImageModel: ObservableObject {
    

    
    // MARK: - Receipt Image
    
    enum ImageState {
        case empty
        case loading(Progress)
        case success(Image)
        case failure(Error)
    }
    
    enum TransferError: Error {
        case importFailed
    }
    
    struct ReceiptImage: Transferable {
        let image: Image
        
        static var transferRepresentation: some TransferRepresentation {
            
            DataRepresentation(importedContentType: .image) { data in
            #if canImport(AppKit)
                guard let nsImage = NSImage(data: data) else {
                    throw TransferError.importFailed
                }
                let image = Image(nsImage: nsImage)
                return ReceiptImage(image: image)
            #elseif canImport(UIKit)
                guard let uiImage = UIImage(data: data) else {
                    throw TransferError.importFailed
                }
//                let receipt = try await receiptScanner.scanImage(uiImage)
//                print(receipt)
                
                let image = Image(uiImage: uiImage)
            
                return ReceiptImage(image: image)
            #else
                throw TransferError.importFailed
            #endif
            }
        }
    }
    
    @Published private(set) var imageState: ImageState = .empty
    
    @Published var imageSelection: PhotosPickerItem? = nil {
        didSet {
            if let imageSelection {
                let progress = loadTransferable(from: imageSelection)
                
                imageState = .loading(progress)
            } else {
                imageState = .empty
            }
        }
    }
    
    // MARK: - Private Methods
    
    private func loadTransferable(from imageSelection: PhotosPickerItem) -> Progress {
        return imageSelection.loadTransferable(type: ReceiptImage.self) { result in
            DispatchQueue.main.async {
                guard imageSelection == self.imageSelection else {
                    print("Failed to get the selected item.")
                    return
                }
                switch result {
                case .success(let profileImage?):
                    self.imageState = .success(profileImage.image)
                case .success(nil):
                    self.imageState = .empty
                case .failure(let error):
                    self.imageState = .failure(error)
                }
            }
        }
    }
}
